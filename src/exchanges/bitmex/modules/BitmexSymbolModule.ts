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
import { Bitmex } from '../Bitmex'
import { BitmexHttp } from '../BitmexHttp'
import { BitmexLog } from '../BitmexLog'
import { PROD_BITMEX_URL } from '../BitmexSpecs'
import { BitmexInstrumentStateEnum } from '../enums/BitmexInstrumentStateEnum'
import { IBitmexSymbolsSchema } from '../schemas/IBitmexSymbolsSchema'



interface IBitmexMarketModule extends IAlunaSymbolModule {
  filterActiveSymbols (
    params: { rawSymbols: IBitmexSymbolsSchema[] }
    ): IBitmexSymbolsSchema[]
}


export const BitmexSymbolModule: IBitmexMarketModule = class {

  public static filterActiveSymbols (params: {
    rawSymbols: IBitmexSymbolsSchema[],
  }): IBitmexSymbolsSchema[] {

    return params
      .rawSymbols
      .filter(
        (rawMarket) => rawMarket.state !== BitmexInstrumentStateEnum.UNLISTED,
      )

  }

  public static async listRaw ()
    : Promise<IAlunaSymbolListRawReturns<IBitmexSymbolsSchema>> {

    BitmexLog.info('fetching Bitmex symbols')

    const { publicRequest } = BitmexHttp

    const {
      data: rawSymbols,
      requestCount,
    } = await publicRequest<IBitmexSymbolsSchema[]>({
      url: `${PROD_BITMEX_URL}/instrument/active`,
    })

    const filteredActiveSymbols = BitmexSymbolModule.filterActiveSymbols({
      rawSymbols,
    })

    return {
      rawSymbols: filteredActiveSymbols,
      requestCount,
    }

  }



  public static async list (): Promise<IAlunaSymbolListReturns> {

    const requestCount = 0

    const {
      rawSymbols,
      requestCount: listRawCount,
    } = await BitmexSymbolModule.listRaw()

    const {
      symbols: parsedSymbols,
      requestCount: parseManyCount,
    } = BitmexSymbolModule.parseMany({ rawSymbols })

    const totalRequestCount = requestCount
      + listRawCount
      + parseManyCount

    return {
      symbols: parsedSymbols,
      requestCount: totalRequestCount,
    }

  }



  public static parse (params:{
    rawSymbol: IBitmexSymbolsSchema,
  }): IAlunaSymbolParseReturns {

    const { rawSymbol } = params

    const { rootSymbol } = rawSymbol

    const id = AlunaSymbolMapping.translateSymbolId({
      exchangeSymbolId: rootSymbol,
      symbolMappings: Bitmex.settings.mappings,
    })

    const alias = id !== rootSymbol
      ? rootSymbol
      : undefined

    const parsedSymbol: IAlunaSymbolSchema = {
      id,
      exchangeId: Bitmex.ID,
      alias,
      meta: rawSymbol,
    }

    return {
      symbol: parsedSymbol,
      requestCount: 0,
    }

  }



  public static parseMany (params: {
    rawSymbols: IBitmexSymbolsSchema[],
  }): IAlunaSymbolParseManyReturns {

    const { rawSymbols } = params

    const parsedSymbolsDictionary: Record<string, IAlunaSymbolSchema> = {}

    let requestCount = 0

    each(rawSymbols, (rawSymbol) => {

      const {
        rootSymbol,
        quoteCurrency,
      } = rawSymbol

      if (!parsedSymbolsDictionary[rootSymbol]) {

        const {
          symbol,
          requestCount: parseCount,
        } = this.parse({ rawSymbol })

        requestCount += parseCount

        parsedSymbolsDictionary[rootSymbol] = symbol

      }

      if (!parsedSymbolsDictionary[quoteCurrency]) {

        const { symbol, requestCount: parseCount } = this.parse({
          rawSymbol: {
            ...rawSymbol,
            rootSymbol: quoteCurrency,
          },
        })

        requestCount += parseCount

        parsedSymbolsDictionary[quoteCurrency] = symbol

      }

    })

    const parsedSymbols = values(parsedSymbolsDictionary)

    BitmexLog.info(`parsed ${parsedSymbols.length} symbols for Bitmex`)

    return {
      symbols: parsedSymbols,
      requestCount,
    }

  }

}
