import { HttpVerbEnum } from '@lib/enums/HtttpVerbEnum'
import {
  IAlunaOrderCancelParams,
  IAlunaOrderPlaceParams,
  IAlunaOrderWriteModule,
} from '@lib/modules/IAlunaOrderModule'
import { IAlunaOrderSchema } from '@lib/schemas/IAlunaOrderSchema'

import { ValrOrderTypeAdapter } from '../enums/adapters/ValrOrderTypeAdapter'
import { ValrSideAdapter } from '../enums/adapters/ValrSideAdapter'
import { ValrOrderStatusEnum } from '../enums/ValrOrderStatusEnum'
import { ValrOrderTypesEnum } from '../enums/ValrOrderTypesEnum'
import { ValrOrderParser } from '../schemas/parsers/ValrOrderParser'
import { ValrError } from '../ValrError'
import { ValrHttp } from '../ValrHttp'
import { ValrOrderReadModule } from './ValrOrderReadModule'



interface IValrPlaceOrderResponse {
  id: string
}



export class ValrOrderWriteModule extends ValrOrderReadModule implements IAlunaOrderWriteModule {

  async place (params: IAlunaOrderPlaceParams): Promise<IAlunaOrderSchema> {

    const {
      amount,
      rate,
      symbolPair,
      side,
      type,
    } = params

    const orderType = ValrOrderTypeAdapter.translateToValr({ type })

    const body = {
      side: ValrSideAdapter.translateToValr({ side }),
      pair: symbolPair,
      ...(
        orderType === ValrOrderTypesEnum.LIMIT
          ? {
            quantity: amount,
            price: rate,
            postOnly: false,
            timeInForce: 'GTC',
          }
          : {
            baseAmount: amount,
          }
      ),
    }

    const { id } = await ValrHttp.privateRequest<IValrPlaceOrderResponse>({
      url: `https://api.valr.com/v1/orders/${orderType}`,
      body,
      keySecret: this.exchange.keySecret,
    })

    const rawOrder = await this.getRaw({
      id,
      symbolPair,
    })

    return ValrOrderParser.parse({
      rawOrder,
    })

  }



  async cancel (params: IAlunaOrderCancelParams): Promise<IAlunaOrderSchema> {

    const body = {
      orderId: params.id,
      pair: params.symbolPair,
    }

    await ValrHttp.privateRequest<void>({
      verb: HttpVerbEnum.DELETE,
      url: 'https://api.valr.com/v1/orders/order',
      keySecret: this.exchange.keySecret,
      body,
    })

    const rawOrder = await this.getRaw(params)

    if (rawOrder.orderStatusType !== ValrOrderStatusEnum.CANCELLED) {

      throw new ValrError({
        message: 'Something went wrong, order not canceled',
        statusCode: 500,
      })

    }

    return ValrOrderParser.parse({
      rawOrder,
    })

  }

}
