import { AAlunaModule } from '../../../lib/core/abstracts/AAlunaModule'
import { AlunaAccountEnum } from '../../../lib/enums/AlunaAccountEnum'
import { AlunaHttpVerbEnum } from '../../../lib/enums/AlunaHtttpVerbEnum'
import {
  IAlunaBalanceListRawReturns,
  IAlunaBalanceListReturns,
  IAlunaBalanceModule,
  IAlunaBalanceParseManyReturns,
  IAlunaBalanceParseReturns,
} from '../../../lib/modules/IAlunaBalanceModule'
import { IAlunaBalanceSchema } from '../../../lib/schemas/IAlunaBalanceSchema'
import { FtxHttp } from '../FtxHttp'
import { FtxLog } from '../FtxLog'
import { PROD_FTX_URL } from '../FtxSpecs'
import { IFtxBalanceSchema } from '../schemas/IFtxBalanceSchema'
import { IFtxResponseSchema } from '../schemas/IFtxSchema'



export class FtxBalanceModule extends AAlunaModule implements IAlunaBalanceModule {

  public async listRaw ()
    : Promise<IAlunaBalanceListRawReturns<IFtxBalanceSchema>> {

    FtxLog.info('fetching Ftx balances')

    const { keySecret } = this.exchange

    const {
      data: { result },
      requestCount,
    } = await FtxHttp
      .privateRequest<IFtxResponseSchema<IFtxBalanceSchema[]>>({
        verb: AlunaHttpVerbEnum.GET,
        url: `${PROD_FTX_URL}/wallet/balances`,
        keySecret,
      })

    return {
      rawBalances: result,
      requestCount,
    }

  }



  public async list (): Promise<IAlunaBalanceListReturns> {

    const requestCount = 0

    const {
      rawBalances,
      requestCount: listRawCount,
    } = await this.listRaw()

    const {
      balances: parsedBalances,
      requestCount: parseManyCount,
    } = this.parseMany({ rawBalances })

    FtxLog.info(`parsed ${parsedBalances.length} balances for Ftx`)

    const totalRequestCount = requestCount
      + listRawCount
      + parseManyCount

    return {
      balances: parsedBalances,
      requestCount: totalRequestCount,
    }

  }



  public parse (params: {
    rawBalance: IFtxBalanceSchema,
  }): IAlunaBalanceParseReturns {

    const { rawBalance } = params

    const {
      free,
      total,
      coin,
    } = rawBalance

    const parsedBalance: IAlunaBalanceSchema = {
      symbolId: coin,
      account: AlunaAccountEnum.EXCHANGE,
      available: free,
      total,
      meta: rawBalance,
    }

    return {
      balance: parsedBalance,
      requestCount: 0,
    }

  }



  public parseMany (params: {
    rawBalances: IFtxBalanceSchema[],
  }): IAlunaBalanceParseManyReturns {

    const { rawBalances } = params

    let requestCount = 0

    const parsedBalances = rawBalances.reduce<IAlunaBalanceSchema[]>(
      (accumulator, rawBalance) => {

        const {
          total,
        } = rawBalance

        if (total > 0) {

          const {
            balance: parsedBalance,
            requestCount: parseCount,
          } = this.parse({ rawBalance })

          requestCount += parseCount

          accumulator.push(parsedBalance)

        }

        return accumulator

      },
      [],
    )

    return {
      balances: parsedBalances,
      requestCount,
    }

  }

}
