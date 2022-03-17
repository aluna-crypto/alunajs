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

    let apiRequestCount = 0

    const {
      apiRequestCount: listRawCount,
      rawSymbols,
    } = await GateioSymbolModule.listRaw()

    apiRequestCount += 1

    const {
      symbols: parsedSymbols,
      apiRequestCount: parseManyCount,
    } = GateioSymbolModule.parseMany({ rawSymbols })

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
    : Promise<IAlunaSymbolListRawReturns<IGateioSymbolSchema>> {

    GateioLog.info('fetching Gateio symbols')

    const { data: rawSymbols, apiRequestCount } = await GateioHttp
      .publicRequest<IGateioSymbolSchema[]>({
        url: `${PROD_GATEIO_URL}/spot/currencies`,
      })

    return {
      rawSymbols,
      apiRequestCount,
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
      apiRequestCount: 1,
    }

  }



  public static parseMany (params: {
    rawSymbols: IGateioSymbolSchema[],
  }): IAlunaSymbolParseManyReturns {

    const { rawSymbols } = params

    let apiRequestCount = 0

    const parsedSymbols = rawSymbols.map((rawSymbol) => {

      const {
        symbol: parsedSymbol,
        apiRequestCount: parseCount,
      } = GateioSymbolModule.parse({ rawSymbol })

      apiRequestCount += parseCount + 1

      return parsedSymbol

    })

    GateioLog.info(`parsed ${parsedSymbols.length} symbols for Gateio`)

    return {
      symbols: parsedSymbols,
      apiRequestCount,
    }

  }

}
