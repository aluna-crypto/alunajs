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
import { IBitmexSymbolsSchema } from '../schemas/IBitmexSymbolsSchema'



export const BitmexSymbolModule: IAlunaSymbolModule = class {

  public static async listRaw ()
    : Promise<IAlunaSymbolListRawReturns<IBitmexSymbolsSchema>> {

    BitmexLog.info('fetching Bitmex symbols')

    const { publicRequest } = BitmexHttp

    const {
      data: rawSymbols,
      apiRequestCount,
    } = await publicRequest<IBitmexSymbolsSchema[]>({
      url: `${PROD_BITMEX_URL}/instrument/active`,
    })

    return {
      rawSymbols,
      apiRequestCount,
    }

  }



  public static async list (): Promise<IAlunaSymbolListReturns> {

    let apiRequestCount = 0

    const {
      rawSymbols,
      apiRequestCount: listRawCount,
    } = await BitmexSymbolModule.listRaw()

    apiRequestCount += 1

    const {
      symbols: parsedSymbols,
      apiRequestCount: parseManyCount,
    } = BitmexSymbolModule.parseMany({ rawSymbols })

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
      apiRequestCount: 1,
    }

  }



  public static parseMany (params: {
    rawSymbols: IBitmexSymbolsSchema[],
  }): IAlunaSymbolParseManyReturns {

    const { rawSymbols } = params

    const parsedSymbolsDictionary: Record<string, IAlunaSymbolSchema> = {}

    let apiRequestCount = 0

    each(rawSymbols, (rawSymbol) => {

      const {
        rootSymbol,
        quoteCurrency,
      } = rawSymbol

      if (!parsedSymbolsDictionary[rootSymbol]) {

        const {
          symbol,
          apiRequestCount: parseCount,
        } = this.parse({ rawSymbol })
        apiRequestCount += parseCount + 1

        parsedSymbolsDictionary[rootSymbol] = symbol

      }

      if (!parsedSymbolsDictionary[quoteCurrency]) {

        const { symbol, apiRequestCount: parseCount } = this.parse({
          rawSymbol: {
            ...rawSymbol,
            rootSymbol: quoteCurrency,
          },
        })

        apiRequestCount += parseCount + 1
        parsedSymbolsDictionary[quoteCurrency] = symbol

      }

    })

    const parsedSymbols = values(parsedSymbolsDictionary)

    BitmexLog.info(`parsed ${parsedSymbols.length} symbols for Bitmex`)

    return {
      symbols: parsedSymbols,
      apiRequestCount,
    }

  }

}
