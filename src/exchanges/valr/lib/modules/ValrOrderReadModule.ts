import { AAlunaModule } from '@lib/abstracts/AAlunaModule'
import { HttpVerbEnum } from '@lib/enums/HtttpVerbEnum'
import {
  IAlunaOrderGetParams,
  IAlunaOrderListParams,
  IAlunaOrderReadModule,
} from '@lib/modules/IAlunaOrderModule'
import { IAlunaOrderSchema } from '@lib/schemas/IAlunaOrderSchema'

import {
  IValrOrderListSchema, IValrOrderGetSchema,
} from '../schemas/IValrOrderSchema'
import { ValrHttp } from '../ValrHttp'
import { ValrOrderParser } from '../schemas/parsers/ValrOrderParser'



export class ValrOrderReadModule extends AAlunaModule implements IAlunaOrderReadModule {

  async listRaw (
    _params?: IAlunaOrderListParams,
  ): Promise<IValrOrderListSchema[]> {


    return ValrHttp.privateRequest<IValrOrderListSchema[]>({
      verb: HttpVerbEnum.GET,
      url: 'https://api.valr.com/v1/orders/open',
      keySecret: this.exchange.keySecret,
    })

  }



  public async list (
    _params?: IAlunaOrderListParams,
  ): Promise<IAlunaOrderSchema[]> {

    return this.parseMany({
      rawOrders: await this.listRaw(),
    })

  }



  getRaw (
    params: IAlunaOrderGetParams,
  ): Promise<IValrOrderGetSchema> {

    const {
      id,
      symbolPair,
    } = params


    return ValrHttp.privateRequest<IValrOrderGetSchema>({
      verb: HttpVerbEnum.GET,
      url: `https://api.valr.com/v1/orders/${symbolPair}/orderid/${id}`,
      keySecret: this.exchange.keySecret,
    })

  }



  async get (
    params: IAlunaOrderGetParams,
  ): Promise<IAlunaOrderSchema> {

    const order = await this.getRaw(params)

    return this.parse({
      rawOrder: order,
    })

  }



  public parse (
    params: {
      rawOrder: IValrOrderListSchema | IValrOrderGetSchema,
    },
  ): IAlunaOrderSchema {

    return ValrOrderParser.parse({
      rawOrder: params.rawOrder,
    })

  }



  public parseMany (
    params: {
      rawOrders: IValrOrderListSchema[],
    },
  ): IAlunaOrderSchema[] {

    return params.rawOrders.map((
      rawOrder: IValrOrderListSchema,
    ) => this.parse({
      rawOrder,
    }))

  }

}
