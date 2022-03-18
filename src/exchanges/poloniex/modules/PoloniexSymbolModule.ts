import {
  IAlunaSymbolListRawReturns,
  IAlunaSymbolListReturns,
  IAlunaSymbolModule,
  IAlunaSymbolParseManyReturns,
  IAlunaSymbolParseReturns,
} from '../../../lib/modules/IAlunaSymbolModule'
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

  public static async listRaw ()
    : Promise<IAlunaSymbolListRawReturns<IPoloniexSymbolWithCurrency>> {

    PoloniexLog.info('fetching Poloniex symbols')

    const query = new URLSearchParams()

    let apiRequestCount = 0

    query.append('command', 'returnCurrencies')

    const {
      data: rawSymbols,
      apiRequestCount: requestCount,
    } = await PoloniexHttp
      .publicRequest<IPoloniexSymbolSchema>({
        url: `${PROD_POLONIEX_URL}/public?${query.toString()}`,
      })

    apiRequestCount += requestCount

    const rawSymbolsWithCurrency = PoloniexCurrencyParser
      .parse<IPoloniexSymbolWithCurrency>({
        rawInfo: rawSymbols,
      })

    apiRequestCount += 1

    return {
      rawSymbols: rawSymbolsWithCurrency,
      apiRequestCount,
    }

  }



  public static async list (): Promise<IAlunaSymbolListReturns> {

    let apiRequestCount = 0

    const {
      rawSymbols,
      apiRequestCount: listRawCount,
    } = await PoloniexSymbolModule.listRaw()

    apiRequestCount += 1

    const {
      symbols: parsedSymbols,
      apiRequestCount: parseManyCount,
    } = PoloniexSymbolModule.parseMany({ rawSymbols })

    apiRequestCount += 1

    const totalApiRequestCount = apiRequestCount
          + listRawCount
          + parseManyCount

    return {
      symbols: parsedSymbols,
      apiRequestCount: totalApiRequestCount,
    }

  }



  public static parse (params:{
    rawSymbol: IPoloniexSymbolWithCurrency,
  }): IAlunaSymbolParseReturns {

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

    return {
      symbol: parsedSymbol,
      apiRequestCount: 1,
    }

  }



  public static parseMany (params: {
    rawSymbols: IPoloniexSymbolWithCurrency[],
  }): IAlunaSymbolParseManyReturns {

    const { rawSymbols } = params

    let apiRequestCount = 0

    const parsedSymbols = rawSymbols.map((rawSymbol) => {

      const {
        apiRequestCount: parseCount,
        symbol: parsedSymbol,
      } = PoloniexSymbolModule.parse({ rawSymbol })

      apiRequestCount += parseCount + 1

      return parsedSymbol

    })

    PoloniexLog.info(`parsed ${parsedSymbols.length} symbols for Poloniex`)

    return {
      symbols: parsedSymbols,
      apiRequestCount,
    }

  }

}
