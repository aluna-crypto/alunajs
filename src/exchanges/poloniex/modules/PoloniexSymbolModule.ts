import { forOwn } from 'lodash'

import { IAlunaSymbolModule } from '../../../lib/modules/IAlunaSymbolModule'
import { IAlunaSymbolSchema } from '../../../lib/schemas/IAlunaSymbolSchema'
import { AlunaSymbolMapping } from '../../../utils/mappings/AlunaSymbolMapping'
import { Poloniex } from '../Poloniex'
import { PoloniexHttp } from '../PoloniexHttp'
import { PoloniexLog } from '../PoloniexLog'
import { PROD_POLONIEX_URL } from '../PoloniexSpecs'
import {
  IPoloniexSymbolSchema,
  IPoloniexSymbolWithCurrency,
} from '../schemas/IPoloniexSymbolSchema'



export const PoloniexSymbolModule: IAlunaSymbolModule = class {

  public static async listRaw (): Promise<IPoloniexSymbolSchema> {

    PoloniexLog.info('fetching Poloniex symbols')

    const query = new URLSearchParams()

    query.append('command', 'returnCurrencies')

    const { publicRequest } = PoloniexHttp

    const rawSymbols = await publicRequest<IPoloniexSymbolSchema>({
      url: `${PROD_POLONIEX_URL}/public?${query.toString()}`,
    })

    return rawSymbols

  }



  public static async list (): Promise<IAlunaSymbolSchema[]> {

    const rawSymbols = await PoloniexSymbolModule.listRaw()

    const parsedSymbols = PoloniexSymbolModule.parseMany({ rawSymbols })

    return parsedSymbols

  }



  public static parse (params:{
    rawSymbol: IPoloniexSymbolWithCurrency,
  }): IAlunaSymbolSchema {

    const { rawSymbol } = params

    const {
      name,
      currency,
    } = rawSymbol

    const id = AlunaSymbolMapping.translateSymbolId({
      exchangeSymbolId: currency,
      symbolMappings: Poloniex.settings.mappings,
    })

    const alias = id !== currency
      ? currency
      : undefined

    const parsedSymbol: IAlunaSymbolSchema = {
      id,
      name,
      exchangeId: Poloniex.ID,
      alias,
      meta: rawSymbol,
    }

    return parsedSymbol

  }



  public static parseMany (params: {
    rawSymbols: IPoloniexSymbolSchema,
  }): IAlunaSymbolSchema[] {

    const { rawSymbols } = params

    const parsedSymbols: IAlunaSymbolSchema[] = []

    forOwn(rawSymbols, (value, key) => {

      const rawSymbol: IPoloniexSymbolWithCurrency = {
        currency: key,
        ...value,
      }

      const parsedMarket = PoloniexSymbolModule.parse({ rawSymbol })

      parsedSymbols.push(parsedMarket)

    })

    PoloniexLog.info(`parsed ${parsedSymbols.length} symbols for Poloniex`)

    return parsedSymbols

  }

}
