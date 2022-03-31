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

    const { data: rawSymbols, requestCount } = await BittrexHttp
      .publicRequest<IBittrexSymbolSchema[]>({
        url: `${PROD_BITTREX_URL}/currencies`,
      })

    return {
      requestCount,
      rawSymbols,
    }

  }



  public static async list (): Promise<IAlunaSymbolListReturns> {

    const requestCount = 0

    const {
      rawSymbols,
      requestCount: listRawCount,
    } = await BittrexSymbolModule.listRaw()

    const {
      symbols,
      requestCount: parseManyCount,
    } = BittrexSymbolModule.parseMany({ rawSymbols })

    const totalRequestCount = requestCount
        + listRawCount
        + parseManyCount

    return {
      symbols,
      requestCount: totalRequestCount,
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

    const requestCount = 0

    const id = AlunaSymbolMapping.translateSymbolId({
      exchangeSymbolId: symbol,
      symbolMappings: Bittrex.settings.mappings,
    })

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
      requestCount,
    }

  }



  public static parseMany (params: {
    rawSymbols: IBittrexSymbolSchema[],
  }): IAlunaSymbolParseManyReturns {

    const { rawSymbols } = params

    let requestCount = 0

    const parsedSymbols = rawSymbols.map((rawSymbol) => {

      const {
        symbol,
        requestCount: parseCount,
      } = BittrexSymbolModule.parse({ rawSymbol })

      requestCount += parseCount

      return symbol

    })

    BittrexLog.info(`parsed ${parsedSymbols.length} symbols for Bittrex`)

    return {
      symbols: parsedSymbols,
      requestCount,
    }

  }

}
