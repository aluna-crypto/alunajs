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
import { PoloniexCurrencyParser } from '../schemas/parsers/PoloniexCurrencyParser'



export const PoloniexSymbolModule: IAlunaSymbolModule = class {

  public static async listRaw (): Promise<IPoloniexSymbolWithCurrency[]> {

    PoloniexLog.info('fetching Poloniex symbols')

    const query = new URLSearchParams()

    query.append('command', 'returnCurrencies')

    const rawSymbols = await PoloniexHttp
      .publicRequest<IPoloniexSymbolSchema>({
        url: `${PROD_POLONIEX_URL}/public?${query.toString()}`,
      })

    const rawSymbolsWithCurrency = PoloniexCurrencyParser
      .parse<IPoloniexSymbolWithCurrency>({
        rawInfo: rawSymbols,
      })

    return rawSymbolsWithCurrency

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
    rawSymbols: IPoloniexSymbolWithCurrency[],
  }): IAlunaSymbolSchema[] {

    const { rawSymbols } = params

    const parsedSymbols = rawSymbols.map((rawSymbol) => {

      const parsedSymbol = PoloniexSymbolModule.parse({ rawSymbol })

      return parsedSymbol

    })

    PoloniexLog.info(`parsed ${parsedSymbols.length} symbols for Poloniex`)

    return parsedSymbols

  }

}
