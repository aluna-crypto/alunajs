import { IAlunaSymbolModule } from '../../../lib/modules/IAlunaSymbolModule'
import { IAlunaSymbolSchema } from '../../../lib/schemas/IAlunaSymbolSchema'
import { AlunaSymbolMapping } from '../../../utils/mappings/AlunaSymbolMapping'
import { Gateio } from '../Gateio'
import { GateioHttp } from '../GateioHttp'
import { GateioLog } from '../GateioLog'
import { PROD_GATEIO_URL } from '../GateioSpecs'
import { IGateioSymbolSchema } from '../schemas/IGateioSymbolSchema'



export const GateioSymbolModule: IAlunaSymbolModule = class {

  public static async list (): Promise<IAlunaSymbolSchema[]> {

    const rawSymbols = await GateioSymbolModule.listRaw()

    const parsedSymbols = GateioSymbolModule.parseMany({ rawSymbols })

    return parsedSymbols

  }



  public static async listRaw (): Promise<IGateioSymbolSchema[]> {

    GateioLog.info('fetching Gateio symbols')

    const rawSymbols = await GateioHttp
      .publicRequest<IGateioSymbolSchema[]>({
        url: `${PROD_GATEIO_URL}/spot/currencies`,
      })

    return rawSymbols

  }



  public static parse (params:{
    rawSymbol: IGateioSymbolSchema,
  }): IAlunaSymbolSchema {

    const { rawSymbol } = params

    const {
      currency,
    } = rawSymbol

    const id = AlunaSymbolMapping.translateSymbolId({
      exchangeSymbolId: currency,
      symbolMappings: Gateio.settings.mappings,
    })

    let alias: string | undefined

    if (id !== currency) {

      alias = currency

    }

    const parsedSymbol = {
      id,
      exchangeId: Gateio.ID,
      alias,
      meta: rawSymbol,
    }

    return parsedSymbol

  }



  public static parseMany (params: {
    rawSymbols: IGateioSymbolSchema[],
  }): IAlunaSymbolSchema[] {

    const { rawSymbols } = params

    const parsedSymbols = rawSymbols.map((rawSymbol) => {

      const parsedSymbol = GateioSymbolModule.parse({ rawSymbol })

      return parsedSymbol

    })

    GateioLog.info(`parsed ${parsedSymbols.length} symbols for Gateio`)

    return parsedSymbols

  }

}
