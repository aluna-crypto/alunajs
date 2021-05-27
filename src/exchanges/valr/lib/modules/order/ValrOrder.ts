import { utc } from 'moment'

import { AAlunaModule } from '@lib/abstracts/AAlunaModule'
import { AccountEnum } from '@lib/enums/AccountEnum'
import {
  IAlunaOrderListParams,
  IAlunaOrderModule,
  IAlunaOrderPlaceParams,
} from '@lib/modules/IAlunaOrderModule'
import { IAlunaOrderSchema } from '@lib/schemas/IAlunaOrderSchema'

import { ValrSideAdapter } from '../../adapters/ValrSideAdapter'
import { ValrStatusAdapter } from '../../adapters/ValrStatusAdapter'
import { ValrTypeAdapter } from '../../adapters/ValrTypeAdapter'
import { ValrRequests } from '../../requests/ValrRequests'
import { IValrOrderSchema } from '../../schemas/IValrOrderSchema'



export class ValrOrder extends AAlunaModule implements IAlunaOrderModule {

  public async list (
    _params?: IAlunaOrderListParams,
  ): Promise<IAlunaOrderSchema[]> {


    const rawOrders = await new ValrRequests().get<IValrOrderSchema[]>({
      url: 'https://api.valr.com/v1/orders/open',
      path: '/v1/orders/open',
      keySecret: this.exchange.keySecret,
    })

    const parsedOrders = this.parseMany({
      rawOrders,
    })

    return parsedOrders

  }



  async place (params: IAlunaOrderPlaceParams): Promise<IAlunaOrderSchema> {

    const {
      amount, rate, symbol, side,
    } = params

    const body = {
      side: ValrSideAdapter.translateToValr({
        side,
      }),
      quantity: amount,
      price: rate,
      pair: symbol,
      postOnly: false,
      timeInForce: 'GTC',
    }


    await new ValrRequests().post<{ id: string }>({
      url: 'https://api.valr.com/v1/orders/limit',
      path: '/v1/orders/limit',
      body,
      keySecret: this.exchange.keySecret,
    })

    throw new Error('Method not implemented.')

  }



  public parse (
    params: {
      rawOrder: IValrOrderSchema
    },
  ): IAlunaOrderSchema {

    const {
      rawOrder: {
        orderId,
        currencyPair,
        side,
        price,
        status,
        type,
        originalQuantity,
        createdAt,
      },
    } = params

    const amount = parseFloat(originalQuantity)

    const rate = parseFloat(price)

    const translatedSide = ValrSideAdapter.translateToAluna({
      side,
    })

    const translatedStatus = ValrStatusAdapter.translateToAluna({
      status,
    })

    const translatedOrder = ValrTypeAdapter.translateToAluna({
      type,
    })

    return {
      id: orderId,
      marketId: currencyPair,
      total: amount * rate,
      amount,
      isAmountInContracts: false,
      rate,
      account: AccountEnum.EXCHANGE,
      side: translatedSide,
      status: translatedStatus,
      type: translatedOrder,
      placedAt: utc(createdAt.replace(/\s/, 'T')).toDate(),
    }

  }



  public parseMany (
    params: {
      rawOrders: IValrOrderSchema[]
    },
  ): IAlunaOrderSchema[] {

    return params.rawOrders.map((rawOrder: IValrOrderSchema) => this.parse({
      rawOrder,
    }))

  }

}
