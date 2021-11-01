import { IAlunaSymbolModule } from '../../../lib/modules/IAlunaSymbolModule'
import { IAlunaSymbolSchema } from '../../../lib/schemas/IAlunaSymbolSchema'
import { GateioLog } from '../GateioLog'
import { IGateioSymbolSchema } from '../schemas/IGateioSymbolSchema'



export const GateioSymbolModule: IAlunaSymbolModule = class {

  public static async list (): Promise<IAlunaSymbolSchema[]> {

    // TODO implement me

    throw new Error('not implemented')


  }



  public static listRaw (): Promise<IGateioSymbolSchema[]> {

    // TODO implement me

    GateioLog.info('fetching Gateio symbols')

    throw new Error('not implemented')

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
