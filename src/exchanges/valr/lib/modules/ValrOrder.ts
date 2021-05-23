import {
  AccountEnum,
} from 'lib/enums/AccountEnum'
import {
  utc,
} from 'moment'

import {
  IAlunaOrder,
  IAlunaOrderListParams,
} from '../../../../lib/modules/IAlunaOrder'
import {
  IAlunaOrderSchema,
} from '../../../../lib/schemas/IAlunaOrderSchema'
import {
  ValrSideAdapter,
} from '../adapters/ValrSideAdapter'
import {
  ValrStatusAdapter,
} from '../adapters/ValrStatusAdapter'
import {
  ValrTypeAdapter,
} from '../adapters/ValrTypeAdapter'
import {
  ValrPrivateRequest,
} from '../requests/ValrPrivateRequest'
import {
  IValrOrderSchema,
} from '../schemas/IValrOrderSchema'



export class ValrOrder extends ValrPrivateRequest implements IAlunaOrder {

  // openOrdersOnly?: boolean
  // start?: number
  // limit?: number

  public async list (
    _params?: IAlunaOrderListParams,
  ): Promise<IAlunaOrderSchema[]> {

    const rawOrders = await this.get<IValrOrderSchema[]>({
      url: 'https://api.valr.com/v1/orders/open',
      path: '/v1/orders/open',
      credentials: this.exchange.keySecret,
    })

    const parsedOrders = this.parseMany({
      rawOrders,
    })

    return parsedOrders

  }



  place (params: IAlunaOrderPlaceParams): Promise<IAlunaOrderSchema> {

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

    const total = amount * rate

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
      total,
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
