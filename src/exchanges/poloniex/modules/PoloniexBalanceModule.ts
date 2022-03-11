import { forOwn } from 'lodash'

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



export class PoloniexBalanceModule extends AAlunaModule implements IAlunaBalanceModule {

  public async listRaw (): Promise<IPoloniexBalanceSchema> {

    PoloniexLog.info('fetching Poloniex balances')

    const { keySecret } = this.exchange

    const timestamp = new Date().getTime()
    const params = new URLSearchParams()

    params.append('command', 'returnCompleteBalances')
    params.append('nonce', timestamp.toString())

    const { privateRequest } = PoloniexHttp

    const rawBalances = await privateRequest<IPoloniexBalanceSchema>({
      keySecret,
      url: `${PROD_POLONIEX_URL}/tradingApi`,
      body: params,
    })

    return rawBalances

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
    rawBalances: IPoloniexBalanceSchema,
  }): IAlunaBalanceSchema[] {

    const { rawBalances } = params

    const parsedBalances: IAlunaBalanceSchema[] = []

    forOwn(rawBalances, (value, key) => {

      const rawBalance: IPoloniexBalanceWithCurrency = {
        currency: key,
        ...value,
      }

      const {
        available,
        onOrders,
      } = rawBalance

      const total = Number(available) + Number(onOrders)

      if (total > 0) {

        const parsedBalance = this.parse({
          rawBalance,
        })

        parsedBalances.push(parsedBalance)

      }

    })

    PoloniexLog.info(`Parsed ${parsedBalances.length} for Poloniex`)

    return parsedBalances

  }

}
