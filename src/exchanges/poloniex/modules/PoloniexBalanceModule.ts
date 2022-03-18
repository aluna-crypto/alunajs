import { AAlunaModule } from '../../../lib/core/abstracts/AAlunaModule'
import { AlunaAccountEnum } from '../../../lib/enums/AlunaAccountEnum'
import {
  IAlunaBalanceListRawReturns,
  IAlunaBalanceListReturns,
  IAlunaBalanceModule,
  IAlunaBalanceParseManyReturns,
  IAlunaBalanceParseReturns,
} from '../../../lib/modules/IAlunaBalanceModule'
import { IAlunaBalanceSchema } from '../../../lib/schemas/IAlunaBalanceSchema'
import { AlunaSymbolMapping } from '../../../utils/mappings/AlunaSymbolMapping'
import { Poloniex } from '../Poloniex'
import { PoloniexHttp } from '../PoloniexHttp'
import { PoloniexLog } from '../PoloniexLog'
import { PROD_POLONIEX_URL } from '../PoloniexSpecs'
import {
  IPoloniexBalanceSchema,
  IPoloniexBalanceWithCurrency,
} from '../schemas/IPoloniexBalanceSchema'
import { PoloniexCurrencyParser } from '../schemas/parsers/PoloniexCurrencyParser'



export class PoloniexBalanceModule extends AAlunaModule implements IAlunaBalanceModule {

  public async listRaw ()
    : Promise<IAlunaBalanceListRawReturns<IPoloniexBalanceWithCurrency>> {

    PoloniexLog.info('fetching Poloniex balances')

    const { keySecret } = this.exchange

    let apiRequestCount = 0

    const timestamp = new Date().getTime()
    const params = new URLSearchParams()

    params.append('command', 'returnCompleteBalances')
    params.append('nonce', timestamp.toString())

    const {
      data: rawBalances,
      apiRequestCount: requestCount,
    } = await PoloniexHttp
      .privateRequest<IPoloniexBalanceSchema>({
        keySecret,
        url: `${PROD_POLONIEX_URL}/tradingApi`,
        body: params,
      })

    apiRequestCount += requestCount

    const rawBalancesWithCurrency = PoloniexCurrencyParser
      .parse<IPoloniexBalanceWithCurrency>({
        rawInfo: rawBalances,
      })

    apiRequestCount += 1

    return {
      rawBalances: rawBalancesWithCurrency,
      apiRequestCount,
    }

  }



  public async list (): Promise<IAlunaBalanceListReturns> {

    let apiRequestCount = 0

    const {
      apiRequestCount: listRawCount,
      rawBalances,
    } = await this.listRaw()


    apiRequestCount += 1

    const {
      balances: parsedBalances,
      apiRequestCount: parseManyCount,
    } = await this.parseMany({ rawBalances })

    apiRequestCount += 1

    PoloniexLog.info(`parsed ${parsedBalances.length} balances for Poloniex`)

    const totalApiRequestCount = apiRequestCount
        + listRawCount
        + parseManyCount

    return {
      balances: parsedBalances,
      apiRequestCount: totalApiRequestCount,
    }

  }



  public parse (params: {
    rawBalance: IPoloniexBalanceWithCurrency,
  }): IAlunaBalanceParseReturns {

    const { rawBalance } = params

    const {
      available,
      currency,
      onOrders,
    } = rawBalance

    const symbolId = AlunaSymbolMapping.translateSymbolId({
      exchangeSymbolId: currency,
      symbolMappings: Poloniex.settings.mappings,
    })

    const total = parseFloat(available) + parseFloat(onOrders)

    const parsedBalance = {
      symbolId,
      account: AlunaAccountEnum.EXCHANGE,
      available: parseFloat(available),
      total,
      meta: rawBalance,
    }

    return {
      balance: parsedBalance,
      apiRequestCount: 1,
    }

  }



  public parseMany (params: {
    rawBalances: IPoloniexBalanceWithCurrency[],
  }): IAlunaBalanceParseManyReturns {

    const { rawBalances } = params

    let apiRequestCount = 0

    const parsedBalances = rawBalances.reduce<IAlunaBalanceSchema[]>(
      (accumulator, rawBalance) => {

        const {
          available,
          onOrders,
        } = rawBalance

        const total = parseFloat(available) + parseFloat(onOrders)

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
