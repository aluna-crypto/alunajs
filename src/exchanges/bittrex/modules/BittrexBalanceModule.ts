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
import { AlunaSymbolMapping } from '../../../utils/mappings/AlunaSymbolMapping'
import { Bittrex } from '../Bittrex'
import { BittrexHttp } from '../BittrexHttp'
import { BittrexLog } from '../BittrexLog'
import { PROD_BITTREX_URL } from '../BittrexSpecs'
import { IBittrexBalanceSchema } from '../schemas/IBittrexBalanceSchema'



export class BittrexBalanceModule extends AAlunaModule implements IAlunaBalanceModule {

  public async listRaw ()
    : Promise<IAlunaBalanceListRawReturns> {

    BittrexLog.info('fetching Bittrex balances')

    const { keySecret } = this.exchange

    const { data: rawAccountInfo, apiRequestCount } = await BittrexHttp
      .privateRequest<IBittrexBalanceSchema[]>({
        verb: AlunaHttpVerbEnum.GET,
        url: `${PROD_BITTREX_URL}/balances`,
        keySecret,
      })

    return {
      apiRequestCount,
      rawBalances: rawAccountInfo,
    }

  }



  public async list (): Promise<IAlunaBalanceListReturns> {

    let apiRequestCount = 0

    const { rawBalances, apiRequestCount: listRawCount } = await this.listRaw()

    apiRequestCount += 1

    const {
      balances: parsedBalances,
      apiRequestCount: parseManyCount,
    } = this.parseMany({ rawBalances })

    apiRequestCount += 1

    BittrexLog.info(`parsed ${parsedBalances.length} balances for Bittrex`)

    const totalApiRequestCount = apiRequestCount
      + listRawCount
      + parseManyCount

    return {
      balances: parsedBalances,
      apiRequestCount: totalApiRequestCount,
    }

  }



  public parse (params: {
    rawBalance: IBittrexBalanceSchema,
  }): IAlunaBalanceParseReturns {

    const { rawBalance } = params

    const {
      total,
      available,
      currencySymbol,
    } = rawBalance

    const symbolId = AlunaSymbolMapping.translateSymbolId({
      exchangeSymbolId: currencySymbol,
      symbolMappings: Bittrex.settings.mappings,
    })

    const balance = {
      symbolId,
      account: AlunaAccountEnum.EXCHANGE,
      available: Number(available),
      total: Number(total),
      meta: rawBalance,
    }

    return {
      balance,
      apiRequestCount: 1,
    }

  }



  public parseMany (params: {
    rawBalances: IBittrexBalanceSchema[],
  }): IAlunaBalanceParseManyReturns {

    const { rawBalances } = params

    let apiRequestCount = 0

    const parsedBalances = rawBalances.reduce<IAlunaBalanceSchema[]>(
      (accumulator, rawBalance) => {

        const {
          total: totalBalance,
        } = rawBalance

        const total = parseFloat(totalBalance)

        if (total > 0) {

          const {
            balance: parsedBalance,
            apiRequestCount: parseCount,
          } = this.parse({ rawBalance })

          apiRequestCount += parseCount + 1

          accumulator.push(parsedBalance)

        }

        return accumulator

      },
      [],
    )

    return {
      balances: parsedBalances,
      apiRequestCount,
    }

  }

}
