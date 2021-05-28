import { AAlunaModule } from '@lib/abstracts/AAlunaModule'
import { HttpVerbEnum } from '@lib/enums/HtttpVerbEnum'
import {
  IAlunaOrderCancelParams, IAlunaOrderPlaceParams, IAlunaOrderWriteModule,
} from '@lib/modules/IAlunaOrderModule'
import { IAlunaOrderSchema } from '@lib/schemas/IAlunaOrderSchema'

import { ValrSideAdapter } from '../adapters/ValrSideAdapter'
import { IValrOrderGetSchema } from '../schemas/IValrOrderSchema'
import { ValrHttp } from '../ValrHttp'
import { ValrOrderParser } from './parsers/ValrOrderParser'



interface IValrPlaceOrderResponse {
  id: string
}



export class ValrOrderWriteModule
  extends AAlunaModule
  implements IAlunaOrderWriteModule {

  async place (
    params: IAlunaOrderPlaceParams,
  ): Promise<IAlunaOrderSchema> {

    const {
      amount,
      rate,
      symbolPair,
      side,
    } = params

    const body = {
      side: ValrSideAdapter.translateToValr({ side }),
      quantity: amount,
      price: rate,
      pair: symbolPair,
      postOnly: false,
      timeInForce: 'GTC',
    }


    const { id } = await ValrHttp.privateRequest<IValrPlaceOrderResponse>({
      url: 'https://api.valr.com/v1/orders/limit',
      body,
      keySecret: this.exchange.keySecret,
    })

    const rawOrder = await ValrHttp.privateRequest<IValrOrderGetSchema>({
      verb: HttpVerbEnum.GET,
      url: `https://api.valr.com/v1/orders/${symbolPair}/orderid/${id}`,
      keySecret: this.exchange.keySecret,
    })

    return ValrOrderParser.parse({
      rawOrder,
    })

  }



  cancel (params: IAlunaOrderCancelParams): Promise<IAlunaOrderSchema> {

    throw new Error('Method not implemented.')

  }

}
