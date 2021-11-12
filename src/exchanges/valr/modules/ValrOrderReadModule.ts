import { AAlunaModule } from '../../../lib/core/abstracts/AAlunaModule'
import { AlunaHttpVerbEnum } from '../../../lib/enums/AlunaHtttpVerbEnum'
import {
  IAlunaOrderGetParams,
  IAlunaOrderReadModule,
} from '../../../lib/modules/IAlunaOrderModule'
import { IAlunaOrderSchema } from '../../../lib/schemas/IAlunaOrderSchema'
import {
  IValrOrderGetSchema,
  IValrOrderListSchema,
} from '../schemas/IValrOrderSchema'
import { ValrOrderParser } from '../schemas/parsers/ValrOrderParser'
import { ValrHttp } from '../ValrHttp'
import { ValrLog } from '../ValrLog'



export class ValrOrderReadModule extends AAlunaModule implements IAlunaOrderReadModule {

  public async listRaw (): Promise<IValrOrderListSchema[]> {

    ValrLog.info('fetching Valr open orders')

    const rawOrders = await ValrHttp.privateRequest<IValrOrderListSchema[]>({
      verb: AlunaHttpVerbEnum.GET,
      url: 'https://api.valr.com/v1/orders/open',
      keySecret: this.exchange.keySecret,
    })

    return rawOrders

  }



  public async list (): Promise<IAlunaOrderSchema[]> {

    const rawOrders = await this.listRaw()

    const parsedOrders = this.parseMany({
      rawOrders,
    })

    return parsedOrders

  }



  public async getRaw (
    params: IAlunaOrderGetParams,
  ): Promise<IValrOrderGetSchema> {

    const {
      id,
      symbolPair,
    } = params

    ValrLog.info('fetching Valr order status')

    const rawOrder = await ValrHttp.privateRequest<IValrOrderGetSchema>({
      verb: AlunaHttpVerbEnum.GET,
      url: `https://api.valr.com/v1/orders/${symbolPair}/orderid/${id}`,
      keySecret: this.exchange.keySecret,
    })

    return rawOrder

  }



  public async get (params: IAlunaOrderGetParams): Promise<IAlunaOrderSchema> {

    const rawOrder = await this.getRaw(params)

    const parsedOrder = this.parse({
      rawOrder,
    })

    return parsedOrder

  }



  public parse (params: {
    rawOrder: IValrOrderListSchema | IValrOrderGetSchema,
  }): IAlunaOrderSchema {

    const { rawOrder } = params

    const parsedOrder = ValrOrderParser.parse({
      rawOrder,
    })

    return parsedOrder

  }



  public parseMany (params: {
    rawOrders: IValrOrderListSchema[],
  }): IAlunaOrderSchema[] {

    const { rawOrders } = params

    const parsedOrders = rawOrders.map((rawOrder: IValrOrderListSchema) => {

      const parsedOrder = this.parse({
        rawOrder,
      })

      return parsedOrder

    })

    ValrLog.info(`parsed ${parsedOrders.length} orders for Valr`)

    return parsedOrders

  }

}
