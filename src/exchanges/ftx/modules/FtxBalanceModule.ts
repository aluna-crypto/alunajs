import { AAlunaModule } from '../../../lib/core/abstracts/AAlunaModule'
import { AlunaAccountEnum } from '../../../lib/enums/AlunaAccountEnum'
import { AlunaHttpVerbEnum } from '../../../lib/enums/AlunaHtttpVerbEnum'
import { IAlunaBalanceModule } from '../../../lib/modules/IAlunaBalanceModule'
import { IAlunaBalanceSchema } from '../../../lib/schemas/IAlunaBalanceSchema'
import { FtxHttp } from '../FtxHttp'
import { FtxLog } from '../FtxLog'
import { PROD_FTX_URL } from '../FtxSpecs'
import { IFtxBalanceSchema } from '../schemas/IFtxBalanceSchema'
import { IFtxResponseSchema } from '../schemas/IFtxSchema'



export class FtxBalanceModule extends AAlunaModule implements IAlunaBalanceModule {

  public async listRaw (): Promise<IFtxBalanceSchema[]> {

    FtxLog.info('fetching Ftx balances')

    const { keySecret } = this.exchange

    const { result } = await FtxHttp
      .privateRequest<IFtxResponseSchema<IFtxBalanceSchema[]>>({
        verb: AlunaHttpVerbEnum.GET,
        url: `${PROD_FTX_URL}/wallet/balances`,
        keySecret,
      })

    return result

  }



  public async list (): Promise<IAlunaBalanceSchema[]> {

    const rawBalances = await this.listRaw()

    const parsedBalances = this.parseMany({ rawBalances })

    FtxLog.info(`parsed ${parsedBalances.length} balances for Ftx`)

    return parsedBalances

  }



  public parse (params: {
    rawBalance: IFtxBalanceSchema,
  }): IAlunaBalanceSchema {

    const { rawBalance } = params

    const {
      free,
      total,
      coin,
    } = rawBalance

    return {
      symbolId: coin,
      account: AlunaAccountEnum.EXCHANGE,
      available: free,
      total,
      meta: rawBalance,
    }

  }



  public parseMany (params: {
    rawBalances: IFtxBalanceSchema[],
  }): IAlunaBalanceSchema[] {

    const { rawBalances } = params

    const parsedBalances = rawBalances.reduce<IAlunaBalanceSchema[]>(
      (accumulator, rawBalance) => {

        const {
          total,
        } = rawBalance

        if (total > 0) {

          const parsedBalance = this.parse({ rawBalance })

          accumulator.push(parsedBalance)

        }

        return accumulator

      },
      [],
    )

    return parsedBalances

  }

}
