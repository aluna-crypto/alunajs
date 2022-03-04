import { AAlunaModule } from '../../../lib/core/abstracts/AAlunaModule'
import { AlunaAccountEnum } from '../../../lib/enums/AlunaAccountEnum'
import { IAlunaBalanceModule } from '../../../lib/modules/IAlunaBalanceModule'
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

  public async listRaw (): Promise<IPoloniexBalanceWithCurrency[]> {

    PoloniexLog.info('fetching Poloniex balances')

    const { keySecret } = this.exchange

    const timestamp = new Date().getTime()
    const params = new URLSearchParams()

    params.append('command', 'returnCompleteBalances')
    params.append('nonce', timestamp.toString())

    const rawBalances = await PoloniexHttp
      .privateRequest<IPoloniexBalanceSchema>({
        keySecret,
        url: `${PROD_POLONIEX_URL}/tradingApi`,
        body: params,
      })

    const rawBalancesWithCurrency = PoloniexCurrencyParser
      .parse<IPoloniexBalanceWithCurrency>({
        rawInfo: rawBalances,
      })

    return rawBalancesWithCurrency

  }



  public async list (): Promise<IAlunaBalanceSchema[]> {

    const rawBalances = await this.listRaw()

    const parsedBalances = this.parseMany({ rawBalances })

    PoloniexLog.info(`parsed ${parsedBalances.length} balances for Poloniex`)

    return parsedBalances

  }



  public parse (params: {
    rawBalance: IPoloniexBalanceWithCurrency,
  }): IAlunaBalanceSchema {

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

    return {
      symbolId,
      account: AlunaAccountEnum.EXCHANGE,
      available: parseFloat(available),
      total,
      meta: rawBalance,
    }

  }



  public parseMany (params: {
    rawBalances: IPoloniexBalanceWithCurrency[],
  }): IAlunaBalanceSchema[] {

    const { rawBalances } = params

    const parsedBalances = rawBalances.reduce<IAlunaBalanceSchema[]>(
      (accumulator, rawBalance) => {

        const {
          available,
          onOrders,
        } = rawBalance

        const total = parseFloat(available) + parseFloat(onOrders)

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
