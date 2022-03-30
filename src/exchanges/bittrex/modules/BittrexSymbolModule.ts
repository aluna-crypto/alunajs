import {
  IAlunaSymbolListRawReturns,
  IAlunaSymbolListReturns,
  IAlunaSymbolModule,
  IAlunaSymbolParseManyReturns,
  IAlunaSymbolParseReturns,
} from '../../../lib/modules/IAlunaSymbolModule'
import { IAlunaSymbolSchema } from '../../../lib/schemas/IAlunaSymbolSchema'
import { AlunaSymbolMapping } from '../../../utils/mappings/AlunaSymbolMapping'
import { Bittrex } from '../Bittrex'
import { BittrexHttp } from '../BittrexHttp'
import { BittrexLog } from '../BittrexLog'
import { PROD_BITTREX_URL } from '../BittrexSpecs'
import { IBittrexSymbolSchema } from '../schemas/IBittrexSymbolSchema'



export const BittrexSymbolModule: IAlunaSymbolModule = class {

  public static async listRaw ()
    : Promise<IAlunaSymbolListRawReturns<IBittrexSymbolSchema>> {

    BittrexLog.info('fetching Bittrex symbols')

    const { data: rawSymbols, apiRequestCount } = await BittrexHttp
      .publicRequest<IBittrexSymbolSchema[]>({
        url: `${PROD_BITTREX_URL}/currencies`,
      })

    return {
      apiRequestCount,
      rawSymbols,
    }

  }



  public static async list (): Promise<IAlunaSymbolListReturns> {

    let apiRequestCount = 0

    const {
      rawSymbols,
      apiRequestCount: listRawCount,
    } = await BittrexSymbolModule.listRaw()

    apiRequestCount += 1

    const {
      symbols,
      apiRequestCount: parseManyCount,
    } = BittrexSymbolModule.parseMany({ rawSymbols })

    apiRequestCount += 1

    const totalApiRequestCount = apiRequestCount
        + listRawCount
        + parseManyCount

    return {
      symbols,
      apiRequestCount: totalApiRequestCount,
    }

  }



  public static parse (params:{
    rawSymbol: IBittrexSymbolSchema,
  }): IAlunaSymbolParseReturns {

    const { rawSymbol } = params

    const {
      symbol,
      name,
    } = rawSymbol

    let apiRequestCount = 0

    const id = AlunaSymbolMapping.translateSymbolId({
      exchangeSymbolId: symbol,
      symbolMappings: Bittrex.settings.mappings,
    })

    apiRequestCount += 1

    const alias = id !== symbol
      ? symbol
      : undefined

    const parsedSymbol: IAlunaSymbolSchema = {
      id,
      name,
      exchangeId: Bittrex.ID,
      alias,
      meta: rawSymbol,
    }

    return {
      symbol: parsedSymbol,
      apiRequestCount,
    }

  }



  public static parseMany (params: {
    rawSymbols: IBittrexSymbolSchema[],
  }): IAlunaSymbolParseManyReturns {

    const { rawSymbols } = params

    let apiRequestCount = 0

    const parsedSymbols = rawSymbols.map((rawSymbol) => {

      const {
        symbol,
        apiRequestCount: parseCount,
      } = BittrexSymbolModule.parse({ rawSymbol })

      apiRequestCount += parseCount + 1

      return symbol

    })

    BittrexLog.info(`parsed ${parsedSymbols.length} symbols for Bittrex`)

    return {
      symbols: parsedSymbols,
      apiRequestCount,
    }

  }

}
