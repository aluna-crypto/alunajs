import { AAlunaModule } from '../../../lib/core/abstracts/AAlunaModule'
import {
  IAlunaOrderGetParams,
  IAlunaOrderReadModule,
} from '../../../lib/modules/IAlunaOrderModule'
import { IAlunaOrderSchema } from '../../../lib/schemas/IAlunaOrderSchema'
import { GateIOLog } from '../GateIOLog'
import { IGateIOOrderSchema } from '../schemas/IGateIOOrderSchema'



export class GateIOOrderReadModule extends AAlunaModule implements IAlunaOrderReadModule {

  public listRaw (): Promise<IGateIOOrderSchema[]> {

    // TODO implement me

    throw new Error('not implemented')

  }



  public async list (): Promise<IAlunaOrderSchema[]> {

    // TODO implement me

    throw new Error('not implemented')

  }



  public getRaw (params: IAlunaOrderGetParams): Promise<IGateIOOrderSchema> {

    // TODO implement me

    const {
      id,
      symbolPair,
    } = params

    GateIOLog.info('fetching GateIO order status')

    throw new Error('not implemented')

  }



  public async get (params: IAlunaOrderGetParams): Promise<IAlunaOrderSchema> {

    // TODO implement me

    throw new Error('not implemented')

  }



  public parse (params: {
    rawOrder: IGateIOOrderSchema,
  }): IAlunaOrderSchema {

    // TODO implement me

    throw new Error('not implemented')

  }



  public parseMany (params: {
    rawOrders: IGateIOOrderSchema[],
  }): IAlunaOrderSchema[] {

    // TODO implement me

    const parsedOrders = params.rawOrders.map((
      rawOrder: IGateIOOrderSchema,
    ) => this.parse({
      rawOrder,
    }))

    GateIOLog.info(`parsed ${parsedOrders.length} orders for GateIO`)

    throw new Error('not implemented')

    return parsedOrders

  }

}
