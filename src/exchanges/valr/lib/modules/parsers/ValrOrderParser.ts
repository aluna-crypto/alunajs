import { utc } from 'moment'

import { AccountEnum } from '@lib/enums/AccountEnum'
import { IAlunaOrderSchema } from '@lib/schemas/IAlunaOrderSchema'


import { ValrOrderTypeAdapter } from '../../adapters/ValrOrderTypeAdapter'
import { ValrSideAdapter } from '../../adapters/ValrSideAdapter'
import { ValrStatusAdapter } from '../../adapters/ValrStatusAdapter'
import {
  IValrOrderSchema, IValrOrderStatusSchema,
} from '../../schemas/IValrOrderSchema'



export class ValrOrderParser {

  static parse (params: {
    rawOrder: IValrOrderSchema | IValrOrderStatusSchema,
  }): IAlunaOrderSchema {

    const { rawOrder } = params

    const {
      orderId,
      currencyPair,
      originalQuantity,
    } = rawOrder

    let side
    let price
    let status
    let type
    let createdAt

    if ((<IValrOrderSchema> rawOrder).side) {

      ({
        side,
        price,
        status,
        type,
        createdAt,
      } = rawOrder as IValrOrderSchema)

    } else {

      ({
        orderSide: side,
        originalPrice: price,
        orderType: type,
        orderStatusType: status,
        orderCreatedAt: createdAt,
      } = rawOrder as IValrOrderStatusSchema)

    }


    const amount = parseFloat(originalQuantity)
    const rate = parseFloat(price)

    const parsedOrder: IAlunaOrderSchema = {
      id: orderId,
      marketId: currencyPair,
      total: amount * rate,
      amount,
      isAmountInContracts: false,
      rate,
      account: AccountEnum.EXCHANGE,
      side: ValrSideAdapter.translateToAluna({ side }),
      status: ValrStatusAdapter.translateToAluna({ status }),
      type: ValrOrderTypeAdapter.translateToAluna({ type }),
      placedAt: utc(createdAt.replace(/\s/, 'T')).toDate(),
    }

    return parsedOrder

  }

}
