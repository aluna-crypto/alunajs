import { IAlunaSymbolModule } from '../../../lib/modules/IAlunaSymbolModule'
import { IAlunaSymbolSchema } from '../../../lib/schemas/IAlunaSymbolSchema'
import { GateioHttp } from '../GateioHttp'
import { GateioLog } from '../GateioLog'
import { IGateioSymbolSchema } from '../schemas/IGateioSymbolSchema'



export const GateioSymbolModule: IAlunaSymbolModule = class {

  public static async list (): Promise<IAlunaSymbolSchema[]> {

    // TODO implement me

    throw new Error('not implemented')


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

    // TODO implement me

    throw new Error('not implemented')

  }



  public static parseMany (params: {
    rawSymbols: IGateioSymbolSchema[],
  }): IAlunaSymbolSchema[] {

    // TODO implement me

    throw new Error('not implemented')

  }

}
