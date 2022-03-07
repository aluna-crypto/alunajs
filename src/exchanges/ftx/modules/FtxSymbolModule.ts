import {
  each,
  values,
} from 'lodash'

import { IAlunaSymbolModule } from '../../../lib/modules/IAlunaSymbolModule'
import { IAlunaSymbolSchema } from '../../../lib/schemas/IAlunaSymbolSchema'
import { Ftx } from '../Ftx'
import { FtxLog } from '../FtxLog'
import { IFtxMarketSchema } from '../schemas/IFtxMarketSchema'
import { FtxMarketModule } from './FtxMarketModule'



export const FtxSymbolModule: IAlunaSymbolModule = class {

  public static async list (): Promise<IAlunaSymbolSchema[]> {

    const rawSymbols = await FtxSymbolModule.listRaw()

    const parsedSymbols = FtxSymbolModule.parseMany({ rawSymbols })

    return parsedSymbols

  }



  public static async listRaw (): Promise<IFtxMarketSchema[]> {

    FtxLog.info('fetching Ftx symbols')

    const markets = await FtxMarketModule.listRaw()

    return markets

  }



  public static parse (params:{
    rawSymbol: IFtxMarketSchema,
  }): IAlunaSymbolSchema {

    const { rawSymbol } = params

    const {
      baseCurrency,
    } = rawSymbol

    const parsedSymbol = {
      id: baseCurrency,
      exchangeId: Ftx.ID,
      meta: rawSymbol,
    }

    return parsedSymbol

  }



  public static parseMany (params: {
    rawSymbols: IFtxMarketSchema[],
  }): IAlunaSymbolSchema[] {

    const { rawSymbols } = params

    const parsedSymbolsDict: Record<string, IAlunaSymbolSchema> = {}

    each(rawSymbols, (symbolPair) => {

      const {
        baseCurrency,
        quoteCurrency,
      } = symbolPair

      if (!parsedSymbolsDict[baseCurrency]) {

        const parsedBaseSymbol = this.parse({ rawSymbol: symbolPair })

        parsedSymbolsDict[baseCurrency] = parsedBaseSymbol

      }

      if (!parsedSymbolsDict[quoteCurrency]) {

        const parsedQuoteSymbol = this.parse({
          rawSymbol: {
            ...symbolPair,
            baseCurrency: quoteCurrency,
          },
        })

        parsedSymbolsDict[quoteCurrency] = parsedQuoteSymbol

      }

    })

    const parsedSymbols = values(parsedSymbolsDict)

    FtxLog.info(`parsed ${parsedSymbols.length} symbols for Ftx`)

    return parsedSymbols

  }

}
