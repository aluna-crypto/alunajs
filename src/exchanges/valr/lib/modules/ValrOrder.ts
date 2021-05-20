import {
  IAlunaOrder,
  IAlunaOrderGetParams,
  IAlunaOrderListParams,
  IAlunaOrderPlaceParams,
} from '../../../../lib/modules/IAlunaOrder'
import { IAlunaOrderSchema } from '../../../../lib/schemas/IAlunaOrderSchema'
import { ValrPrivateRequest } from '../requests/ValrPrivateRequest'
import { IValrOrderSchema } from '../schemas/IValrOrderSchema'



export class ValrOrder extends ValrPrivateRequest implements IAlunaOrder {

  public async list (
    _params?: IAlunaOrderListParams,
  ): Promise<IAlunaOrderSchema[]> {

    const rawOrders = await this.post<IValrOrderSchema[]>({
      url: '/list-orders',
      params: {},
    })

    const parsedOrders = this.parseMany({ rawOrders })

    return parsedOrders

  }



  public async get (
    params: IAlunaOrderGetParams,
  ): Promise<IAlunaOrderSchema> {

    const {
      id,
    } = params

    const rawOrder = await this.post<IValrOrderSchema>({
      url: '/get-order',
      params: { id },
    })

    const parsedOrder = this.parse({ rawOrder })

    return parsedOrder

  }



  public async place (
    params: IAlunaOrderPlaceParams,
  ): Promise<IAlunaOrderSchema> {

    const {
      rate,
      symbol,
    } = params

    const addedOrder = await this.post<IValrOrderSchema>({
      url: '/place-order',
      params: {
        rate,
        symbol,
      },
    })

    const parsedOrder = this.parse({ rawOrder: addedOrder })

    return parsedOrder

  }



  public parse (
    params: {
      rawOrder: IValrOrderSchema,
    },
  ): IAlunaOrderSchema {

    // TODO: implement me
    const x: any = params
    return x

  }



  public parseMany (
    params: {
      rawOrders: IValrOrderSchema[],
    },
  ): IAlunaOrderSchema[] {
    return params.rawOrders.map((rawOrder: IValrOrderSchema) =>
      this.parse({ rawOrder })
    )
  }

}
