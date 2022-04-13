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
import { Ftx } from '../Ftx'
import { FtxLog } from '../FtxLog'
import { IFtxMarketSchema } from '../schemas/IFtxMarketSchema'
import { FtxMarketModule } from './FtxMarketModule'



export const FtxSymbolModule: IAlunaSymbolModule = class {

  public static async list (): Promise<IAlunaSymbolListReturns> {

    const requestCount = 0

    const {
      rawSymbols,
      requestCount: listRawCount,
    } = await FtxSymbolModule.listRaw()

    const {
      symbols: parsedSymbols,
      requestCount: parseManyCount,
    } = FtxSymbolModule.parseMany({ rawSymbols })

    const totalRequestCount = requestCount
      + listRawCount
      + parseManyCount

    return {
      symbols: parsedSymbols,
      requestCount: totalRequestCount,
    }

  }



  public static async listRaw ()
    : Promise<IAlunaSymbolListRawReturns<IFtxMarketSchema>> {

    FtxLog.info('fetching Ftx symbols')

    const requestCount = 0

    const {
      rawMarkets,
      requestCount: listRawCount,
    } = await FtxMarketModule.listRaw()

    const totalRequestCount = requestCount + listRawCount

    return {
      rawSymbols: rawMarkets,
      requestCount: totalRequestCount,
    }

  }



  public static parse (params:{
    rawSymbol: IFtxMarketSchema,
  }): IAlunaSymbolParseReturns {

    const { rawSymbol } = params

    const {
      baseCurrency,
    } = rawSymbol

    const parsedSymbol = {
      id: baseCurrency,
      exchangeId: Ftx.ID,
      meta: rawSymbol,
    }

    return {
      symbol: parsedSymbol,
      requestCount: 0,
    }

  }



  public static parseMany (params: {
    rawSymbols: IFtxMarketSchema[],
  }): IAlunaSymbolParseManyReturns {

    const { rawSymbols } = params

    const parsedSymbolsDict: Record<string, IAlunaSymbolSchema> = {}

    let requestCount = 0

    each(rawSymbols, (symbolPair) => {

      const {
        baseCurrency,
        quoteCurrency,
      } = symbolPair

      if (!parsedSymbolsDict[baseCurrency]) {

        const {
          symbol: parsedBaseSymbol,
          requestCount: parseCount,
        } = this.parse({ rawSymbol: symbolPair })

        requestCount += parseCount

        parsedSymbolsDict[baseCurrency] = parsedBaseSymbol

      }

      if (!parsedSymbolsDict[quoteCurrency]) {

        const {
          symbol: parsedQuoteSymbol,
          requestCount: parseCount,
        } = this.parse({
          rawSymbol: {
            ...symbolPair,
            baseCurrency: quoteCurrency,
          },
        })

        requestCount += parseCount

        parsedSymbolsDict[quoteCurrency] = parsedQuoteSymbol

      }

    })

    const parsedSymbols = values(parsedSymbolsDict)

    FtxLog.info(`parsed ${parsedSymbols.length} symbols for Ftx`)

    return {
      symbols: parsedSymbols,
      requestCount,
    }

  }

}
