import { IAlunaSymbolModule } from '../../../lib/modules/IAlunaSymbolModule'
import { IAlunaSymbolSchema } from '../../../lib/schemas/IAlunaSymbolSchema'
import { GateioHttp } from '../GateioHttp'
import { GateioLog } from '../GateioLog'
import { IGateioSymbolSchema } from '../schemas/IGateioSymbolSchema'



export const GateioSymbolModule: IAlunaSymbolModule = class {

  public static async list (): Promise<IAlunaSymbolSchema[]> {

    return GateioSymbolModule.parseMany({
      rawSymbols: await GateioSymbolModule.listRaw(),
    })

  }



  public static listRaw (): Promise<IGateioSymbolSchema[]> {

    GateioLog.info('fetching Gateio symbols')

    return GateioHttp.publicRequest<IGateioSymbolSchema[]>({
      url: 'https://api.gateio.ws/api/v4/spot/currencies',
    })

  }



  public static parse (params:{
    rawSymbol: IGateioSymbolSchema,
  }): IAlunaSymbolSchema {

    const {
      rawSymbol: {
        currency,
      },
    } = params

    return {
      id: currency,
    }

  }



  public static parseMany (params: {
    rawSymbols: IGateioSymbolSchema[],
  }): IAlunaSymbolSchema[] {

    const {
      rawSymbols,
    } = params


    const parsedSymbols = rawSymbols
      .map((rawSymbol) => GateioSymbolModule.parse({
        rawSymbol,
      }))

    GateioLog.info(`parsed ${parsedSymbols.length} symbols for Gate.io`)

    return parsedSymbols

  }

}
