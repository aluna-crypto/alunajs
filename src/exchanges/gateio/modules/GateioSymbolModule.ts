import {
  IAlunaSymbolListRawReturns,
  IAlunaSymbolListReturns,
  IAlunaSymbolModule,
  IAlunaSymbolParseManyReturns,
  IAlunaSymbolParseReturns,
} from '../../../lib/modules/IAlunaSymbolModule'
import { AlunaSymbolMapping } from '../../../utils/mappings/AlunaSymbolMapping'
import { Gateio } from '../Gateio'
import { GateioHttp } from '../GateioHttp'
import { GateioLog } from '../GateioLog'
import { PROD_GATEIO_URL } from '../GateioSpecs'
import { IGateioSymbolSchema } from '../schemas/IGateioSymbolSchema'



export const GateioSymbolModule: IAlunaSymbolModule = class {

  public static async list (): Promise<IAlunaSymbolListReturns> {

    const requestCount = 0

    const {
      requestCount: listRawCount,
      rawSymbols,
    } = await GateioSymbolModule.listRaw()

    const {
      symbols: parsedSymbols,
      requestCount: parseManyCount,
    } = GateioSymbolModule.parseMany({ rawSymbols })

    const totalRequestCount = requestCount
      + listRawCount
      + parseManyCount

    return {
      symbols: parsedSymbols,
      requestCount: totalRequestCount,
    }

  }



  public static async listRaw ()
    : Promise<IAlunaSymbolListRawReturns<IGateioSymbolSchema>> {

    GateioLog.info('fetching Gateio symbols')

    const { data: rawSymbols, requestCount } = await GateioHttp
      .publicRequest<IGateioSymbolSchema[]>({
        url: `${PROD_GATEIO_URL}/spot/currencies`,
      })

    return {
      rawSymbols,
      requestCount,
    }

  }



  public static parse (params:{
    rawSymbol: IGateioSymbolSchema,
  }): IAlunaSymbolParseReturns {

    const { rawSymbol } = params

    const {
      currency,
    } = rawSymbol

    const id = AlunaSymbolMapping.translateSymbolId({
      exchangeSymbolId: currency,
      symbolMappings: Gateio.settings.mappings,
    })

    const alias = id !== currency
      ? currency
      : undefined

    const parsedSymbol = {
      id,
      exchangeId: Gateio.ID,
      alias,
      meta: rawSymbol,
    }

    return {
      symbol: parsedSymbol,
      requestCount: 0,
    }

  }



  public static parseMany (params: {
    rawSymbols: IGateioSymbolSchema[],
  }): IAlunaSymbolParseManyReturns {

    const { rawSymbols } = params

    let requestCount = 0

    const parsedSymbols = rawSymbols.map((rawSymbol) => {

      const {
        symbol: parsedSymbol,
        requestCount: parseCount,
      } = GateioSymbolModule.parse({ rawSymbol })

      requestCount += parseCount

      return parsedSymbol

    })

    GateioLog.info(`parsed ${parsedSymbols.length} symbols for Gateio`)

    return {
      symbols: parsedSymbols,
      requestCount,
    }

  }

}
