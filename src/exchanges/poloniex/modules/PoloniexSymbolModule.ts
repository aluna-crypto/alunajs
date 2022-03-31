import {
  forOwn,
  map,
} from 'lodash'

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



export const PoloniexSymbolModule: IAlunaSymbolModule = class {

  public static async listRaw ()
    : Promise<IAlunaSymbolListRawReturns<IPoloniexSymbolWithCurrency>> {

    PoloniexLog.info('fetching Poloniex symbols')

    const query = new URLSearchParams()

    let requestCount = 0

    query.append('command', 'returnCurrencies')

    const {
      data: rawSymbols,
      requestCount: privateRequestCount,
    } = await PoloniexHttp
      .publicRequest<IPoloniexSymbolSchema>({
        url: `${PROD_POLONIEX_URL}/public?${query.toString()}`,
      })

    requestCount += privateRequestCount

    const rawSymbolsWithCurrency: IPoloniexSymbolWithCurrency[] = []

    forOwn(rawSymbols, (value, key) => {

      rawSymbolsWithCurrency.push({
        currency: key,
        ...value,
      })

    })

    return {
      rawSymbols: rawSymbolsWithCurrency,
      requestCount,
    }

  }



  public static async list (): Promise<IAlunaSymbolListReturns> {

    const requestCount = 0

    const {
      rawSymbols,
      requestCount: listRawCount,
    } = await PoloniexSymbolModule.listRaw()

    const {
      symbols: parsedSymbols,
      requestCount: parseManyCount,
    } = PoloniexSymbolModule.parseMany({ rawSymbols })

    const totalRequestCount = requestCount
      + listRawCount
      + parseManyCount

    return {
      symbols: parsedSymbols,
      requestCount: totalRequestCount,
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
      requestCount: 0,
    }

  }



  public static parseMany (params: {
    rawSymbols: IPoloniexSymbolWithCurrency[],
  }): IAlunaSymbolParseManyReturns {

    const { rawSymbols } = params

    let requestCount = 0

    const parsedSymbols = map(rawSymbols, (rawSymbol) => {

      const {
        requestCount: parseCount,
        symbol: parsedSymbol,
      } = PoloniexSymbolModule.parse({ rawSymbol })

      requestCount += parseCount

      return parsedSymbol

    })

    PoloniexLog.info(`parsed ${parsedSymbols.length} symbols for Poloniex`)

    return {
      symbols: parsedSymbols,
      requestCount,
    }

  }

}
