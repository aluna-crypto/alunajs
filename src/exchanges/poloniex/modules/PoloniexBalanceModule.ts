import {
  forEach,
  forOwn,
} from 'lodash'

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



export class PoloniexBalanceModule extends AAlunaModule implements IAlunaBalanceModule {

  public async listRaw ()
    : Promise<IAlunaBalanceListRawReturns<IPoloniexBalanceWithCurrency>> {

    PoloniexLog.info('fetching Poloniex balances')

    const { keySecret } = this.exchange

    let requestCount = 0

    const timestamp = new Date().getTime()
    const params = new URLSearchParams()

    params.append('command', 'returnCompleteBalances')
    params.append('nonce', timestamp.toString())

    const { privateRequest } = PoloniexHttp

    const {
      data: rawBalances,
      requestCount: privateRequestCount,
    } = await privateRequest<IPoloniexBalanceSchema>({
      keySecret,
      url: `${PROD_POLONIEX_URL}/tradingApi`,
      body: params,
    })

    requestCount += privateRequestCount

    const rawBalancesWithCurrency: IPoloniexBalanceWithCurrency[] = []

    forOwn(rawBalances, (value, key) => {

      rawBalancesWithCurrency.push({
        currency: key,
        ...value,
      })

    })

    return {
      rawBalances: rawBalancesWithCurrency,
      requestCount,
    }

  }



  public async list (): Promise<IAlunaBalanceListReturns> {

    const requestCount = 0

    const {
      requestCount: listRawCount,
      rawBalances,
    } = await this.listRaw()

    const {
      balances: parsedBalances,
      requestCount: parseManyCount,
    } = this.parseMany({ rawBalances })

    PoloniexLog.info(`parsed ${parsedBalances.length} balances for Poloniex`)

    const totalRequestCount = requestCount
        + listRawCount
        + parseManyCount

    return {
      balances: parsedBalances,
      requestCount: totalRequestCount,
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
      requestCount: 0,
    }

  }



  public parseMany (params: {
    rawBalances: IPoloniexBalanceWithCurrency[],
  }): IAlunaBalanceParseManyReturns {

    const { rawBalances } = params

    let requestCount = 0

    const parsedBalances: IAlunaBalanceSchema[] = []

    forEach(rawBalances, (rawBalance) => {

      const {
        available,
        onOrders,
      } = rawBalance

      const total = Number(available) + Number(onOrders)

      if (total > 0) {

        const {
          balance: parsedBalance,
          requestCount: parseCount,
        } = this.parse({ rawBalance })

        requestCount += parseCount

        parsedBalances.push(parsedBalance)

      }

    })

    PoloniexLog.info(`Parsed ${parsedBalances.length} for Poloniex`)

    return {
      balances: parsedBalances,
      requestCount,
    }

  }

}
