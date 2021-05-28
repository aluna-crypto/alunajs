import { AAlunaModule } from '@lib/abstracts/AAlunaModule'
import {
  IAlunaOrderGetParams,
  IAlunaOrderListParams,
  IAlunaOrderModule,
  IAlunaOrderPlaceParams,
} from '@lib/modules/IAlunaOrderModule'
import { IAlunaOrderSchema } from '@lib/schemas/IAlunaOrderSchema'

import { ValrSideAdapter } from '../adapters/ValrSideAdapter'
import {
  IValrOrderSchema, IValrOrderStatusSchema,
} from '../schemas/IValrOrderSchema'
import { ValrRequest } from '../ValrRequest'
import { ValrOrderParser } from './parsers/ValrOrderParser'



interface IValrPlaceOrderResponse {
  id: string
}


interface IValrOrderGetParams extends IAlunaOrderGetParams {
  symbol: string
}



export class ValrOrderModule extends AAlunaModule implements IAlunaOrderModule {

  public async list (
    _params?: IAlunaOrderListParams,
  ): Promise<IAlunaOrderSchema[]> {

    return this.parseMany({
      rawOrders: await this.listRaw(),
    })

  }



  async listRaw (
    _params?: IAlunaOrderListParams,
  ): Promise<IValrOrderSchema[]> {

    return new ValrRequest().get<IValrOrderSchema[]>({
      url: 'https://api.valr.com/v1/orders/open',
      keySecret: this.exchange.keySecret,
    })

  }


  async get (
    params: IValrOrderGetParams,
  ): Promise<IAlunaOrderSchema> {

    const {
      id,
      symbol,
    } = params

    const order = await new ValrRequest().get<IValrOrderStatusSchema>({
      url: `https://api.valr.com/v1/orders/${symbol}/orderid/${id}`,
      keySecret: this.exchange.keySecret,
    })

    return this.parse({
      rawOrder: order,
    })

  }

  getRaw (
    params: IValrOrderGetParams,
  ): Promise<IValrOrderStatusSchema> {

    const {
      id,
      symbol,
    } = params

    return new ValrRequest().get<IValrOrderStatusSchema>({
      url: `https://api.valr.com/v1/orders/${symbol}/orderid/${id}`,
      keySecret: this.exchange.keySecret,
    })

  }



  async place (
    params: IAlunaOrderPlaceParams,
  ): Promise<IAlunaOrderSchema> {

    const {
      amount, rate, symbol, side,
    } = params

    const body = {
      side: ValrSideAdapter.translateToValr({ side }),
      quantity: amount,
      price: rate,
      pair: symbol,
      postOnly: false,
      timeInForce: 'GTC',
    }


    const { id } = await new ValrRequest().post<IValrPlaceOrderResponse>({
      url: 'https://api.valr.com/v1/orders/limit',
      body,
      keySecret: this.exchange.keySecret,
    })

    return this.get({
      id,
      symbol,
    })

  }



  public parse (
    params: {
      rawOrder: IValrOrderSchema | IValrOrderStatusSchema,
    },
  ): IAlunaOrderSchema {

    return ValrOrderParser.parse({
      rawOrder: params.rawOrder,
    })

  }



  public parseMany (
    params: {
      rawOrders: IValrOrderSchema[],
    },
  ): IAlunaOrderSchema[] {

    return params.rawOrders.map((rawOrder: IValrOrderSchema) => this.parse({
      rawOrder,
    }))

  }

}
