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

    let apiRequestCount = 0

    const {
      rawSymbols,
      apiRequestCount: listRawRequestCount,
    } = await BinanceSymbolModule.listRaw()

    apiRequestCount += 1

    const {
      symbols: parsedSymbols,
      apiRequestCount: parseManyRequestCount,
    } = BinanceSymbolModule.parseMany({ rawSymbols })

    apiRequestCount += 1

    const totalApiRequestCount = apiRequestCount
      + parseManyRequestCount
      + listRawRequestCount

    return {
      symbols: parsedSymbols,
      apiRequestCount: totalApiRequestCount,
    }

  }



  public static async listRaw ()
    : Promise<IAlunaSymbolListRawReturns<IBinanceSymbolSchema>> {

    BinanceLog.info('fetching Binance symbols')

    const { publicRequest } = BinanceHttp

    const {
      data: { symbols },
      apiRequestCount,
    } = await publicRequest<IBinanceInfoSchema>({
      url: `${PROD_BINANCE_URL}/api/v3/exchangeInfo`,
    })

    return {
      rawSymbols: symbols,
      apiRequestCount,
    }

  }



  public static parse (params:{
    rawSymbol: IBinanceSymbolSchema,
  }): IAlunaSymbolParseReturns {

    const { rawSymbol } = params

    let apiRequestCount = 0

    const {
      baseAsset,
    } = rawSymbol

    const symbolMappings = Binance.settings.mappings

    const id = AlunaSymbolMapping.translateSymbolId({
      exchangeSymbolId: baseAsset,
      symbolMappings,
    })

    apiRequestCount += 1

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
      apiRequestCount,
      symbol: parsedSymbol,
    }

  }



  public static parseMany (params: {
    rawSymbols: IBinanceSymbolSchema[],
  }): IAlunaSymbolParseManyReturns {

    const { rawSymbols } = params

    let apiRequestCount = 0

    const parsedSymbolsDict: Record<string, IAlunaSymbolSchema> = {}

    each(rawSymbols, (symbolPair) => {

      const {
        baseAsset,
        quoteAsset,
      } = symbolPair

      if (!parsedSymbolsDict[baseAsset]) {

        const {
          symbol: parsedBaseSymbol,
          apiRequestCount: parseRequestCount,
        } = this.parse({ rawSymbol: symbolPair })

        apiRequestCount += parseRequestCount + 1

        parsedSymbolsDict[baseAsset] = parsedBaseSymbol

      }

      if (!parsedSymbolsDict[quoteAsset]) {

        const {
          symbol: parsedQuoteSymbol,
          apiRequestCount: parseRequestCount,
        } = this.parse({
          rawSymbol: {
            ...symbolPair,
            baseAsset: symbolPair.quoteAsset,
          },
        })

        apiRequestCount += parseRequestCount + 1

        parsedSymbolsDict[quoteAsset] = parsedQuoteSymbol

      }

    })

    const parsedSymbols = values(parsedSymbolsDict)

    BinanceLog.info(`parsed ${parsedSymbols.length} symbols for Binance`)

    return {
      symbols: parsedSymbols,
      apiRequestCount,
    }

  }

}
