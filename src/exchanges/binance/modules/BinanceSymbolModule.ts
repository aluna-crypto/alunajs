import {
  each,
  values,
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
import { Binance } from '../Binance'
import { BinanceHttp } from '../BinanceHttp'
import { BinanceLog } from '../BinanceLog'
import { PROD_BINANCE_URL } from '../BinanceSpecs'
import { IBinanceInfoSchema } from '../schemas/IBinanceInfoSchemas'
import { IBinanceSymbolSchema } from '../schemas/IBinanceSymbolSchema'



export const BinanceSymbolModule: IAlunaSymbolModule = class {

  public static async list (): Promise<IAlunaSymbolListReturns> {

    const requestCount = 0

    const {
      rawSymbols,
      requestCount: listRawCount,
    } = await BinanceSymbolModule.listRaw()

    const {
      symbols: parsedSymbols,
      requestCount: parseManyCount,
    } = BinanceSymbolModule.parseMany({ rawSymbols })

    const totalRequestCount = requestCount
      + parseManyCount
      + listRawCount

    return {
      symbols: parsedSymbols,
      requestCount: totalRequestCount,
    }

  }



  public static async listRaw ()
    : Promise<IAlunaSymbolListRawReturns<IBinanceSymbolSchema>> {

    BinanceLog.info('fetching Binance symbols')

    const { publicRequest } = BinanceHttp

    const {
      data: { symbols },
      requestCount,
    } = await publicRequest<IBinanceInfoSchema>({
      url: `${PROD_BINANCE_URL}/api/v3/exchangeInfo`,
    })

    return {
      rawSymbols: symbols,
      requestCount,
    }

  }



  public static parse (params:{
    rawSymbol: IBinanceSymbolSchema,
  }): IAlunaSymbolParseReturns {

    const { rawSymbol } = params

    const requestCount = 0

    const {
      baseAsset,
    } = rawSymbol

    const symbolMappings = Binance.settings.mappings

    const id = AlunaSymbolMapping.translateSymbolId({
      exchangeSymbolId: baseAsset,
      symbolMappings,
    })

    const alias = id !== baseAsset
      ? baseAsset
      : undefined

    const parsedSymbol: IAlunaSymbolSchema = {
      id,
      exchangeId: Binance.ID,
      alias,
      meta: rawSymbol,
    }

    return {
      symbol: parsedSymbol,
      requestCount,
    }

  }



  public static parseMany (params: {
    rawSymbols: IBinanceSymbolSchema[],
  }): IAlunaSymbolParseManyReturns {

    const { rawSymbols } = params

    let requestCount = 0

    const parsedSymbolsDict: Record<string, IAlunaSymbolSchema> = {}

    each(rawSymbols, (symbolPair) => {

      const {
        baseAsset,
        quoteAsset,
      } = symbolPair

      if (!parsedSymbolsDict[baseAsset]) {

        const {
          symbol: parsedBaseSymbol,
          requestCount: parseCount,
        } = this.parse({ rawSymbol: symbolPair })

        requestCount += parseCount

        parsedSymbolsDict[baseAsset] = parsedBaseSymbol

      }

      if (!parsedSymbolsDict[quoteAsset]) {

        const {
          symbol: parsedQuoteSymbol,
          requestCount: parseCount,
        } = this.parse({
          rawSymbol: {
            ...symbolPair,
            baseAsset: symbolPair.quoteAsset,
          },
        })

        requestCount += parseCount

        parsedSymbolsDict[quoteAsset] = parsedQuoteSymbol

      }

    })

    const parsedSymbols = values(parsedSymbolsDict)

    BinanceLog.info(`parsed ${parsedSymbols.length} symbols for Binance`)

    return {
      symbols: parsedSymbols,
      requestCount,
    }

  }

}
