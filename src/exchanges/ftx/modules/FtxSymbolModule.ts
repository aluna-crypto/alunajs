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

    let apiRequestCount = 0

    const {
      rawSymbols,
      apiRequestCount: listRawCount,
    } = await FtxSymbolModule.listRaw()

    apiRequestCount += 1

    const {
      symbols: parsedSymbols,
      apiRequestCount: parseManyCount,
    } = FtxSymbolModule.parseMany({ rawSymbols })

    apiRequestCount += 1

    const totalApiRequestCount = apiRequestCount
      + listRawCount
      + parseManyCount

    return {
      symbols: parsedSymbols,
      apiRequestCount: totalApiRequestCount,
    }

  }



  public static async listRaw ()
    : Promise<IAlunaSymbolListRawReturns<IFtxMarketSchema>> {

    FtxLog.info('fetching Ftx symbols')

    let apiRequestCount = 0

    const {
      rawMarkets,
      apiRequestCount: listRawCount,
    } = await FtxMarketModule.listRaw()

    apiRequestCount += 1

    const totalApiRequestCount = apiRequestCount + listRawCount

    return {
      rawSymbols: rawMarkets,
      apiRequestCount: totalApiRequestCount,
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
      apiRequestCount: 0,
    }

  }



  public static parseMany (params: {
    rawSymbols: IFtxMarketSchema[],
  }): IAlunaSymbolParseManyReturns {

    const { rawSymbols } = params

    const parsedSymbolsDict: Record<string, IAlunaSymbolSchema> = {}

    let apiRequestCount = 0

    each(rawSymbols, (symbolPair) => {

      const {
        baseCurrency,
        quoteCurrency,
      } = symbolPair

      if (!parsedSymbolsDict[baseCurrency]) {

        const {
          symbol: parsedBaseSymbol,
          apiRequestCount: parseCount,
        } = this.parse({ rawSymbol: symbolPair })

        apiRequestCount += parseCount + 1

        parsedSymbolsDict[baseCurrency] = parsedBaseSymbol

      }

      if (!parsedSymbolsDict[quoteCurrency]) {

        const {
          symbol: parsedQuoteSymbol,
          apiRequestCount: parseCount,
        } = this.parse({
          rawSymbol: {
            ...symbolPair,
            baseCurrency: quoteCurrency,
          },
        })

        apiRequestCount += parseCount + 1

        parsedSymbolsDict[quoteCurrency] = parsedQuoteSymbol

      }

    })

    const parsedSymbols = values(parsedSymbolsDict)

    FtxLog.info(`parsed ${parsedSymbols.length} symbols for Ftx`)

    return {
      symbols: parsedSymbols,
      apiRequestCount,
    }

  }

}
