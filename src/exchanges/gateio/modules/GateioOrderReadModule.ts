import { AAlunaModule } from '../../../lib/core/abstracts/AAlunaModule'
import {
  IAlunaOrderGetParams,
  IAlunaOrderReadModule,
} from '../../../lib/modules/IAlunaOrderModule'
import { IAlunaOrderSchema } from '../../../lib/schemas/IAlunaOrderSchema'
import { GateioLog } from '../GateioLog'
import { IGateioOrderSchema } from '../schemas/IGateioOrderSchema'



export class GateioOrderReadModule extends AAlunaModule implements IAlunaOrderReadModule {

  public listRaw (): Promise<IGateioOrderSchema[]> {

    // TODO implement me

    throw new Error('not implemented')

  }



  public async list (): Promise<IAlunaOrderSchema[]> {

    // TODO implement me

    throw new Error('not implemented')

  }



  public getRaw (params: IAlunaOrderGetParams): Promise<IGateioOrderSchema> {

    // TODO implement me

    const {
      id,
      symbolPair,
    } = params

    GateioLog.info('fetching Gateio order status')

    throw new Error('not implemented')

  }



  public async get (params: IAlunaOrderGetParams): Promise<IAlunaOrderSchema> {

    // TODO implement me

    throw new Error('not implemented')

  }



  public parse (params: {
    rawOrder: IGateioOrderSchema,
  }): IAlunaOrderSchema {

    // TODO implement me

    throw new Error('not implemented')

  }



  public parseMany (params: {
    rawOrders: IGateioOrderSchema[],
  }): IAlunaOrderSchema[] {

    // TODO implement me

    const parsedOrders = params.rawOrders.map((
      rawOrder: IGateioOrderSchema,
    ) => this.parse({
      rawOrder,
    }))

    GateioLog.info(`parsed ${parsedOrders.length} orders for Gateio`)

    throw new Error('not implemented')

    return parsedOrders

  }

}
