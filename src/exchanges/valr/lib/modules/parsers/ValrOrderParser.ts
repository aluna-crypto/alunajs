import { utc } from 'moment'

import { AccountEnum } from '@lib/enums/AccountEnum'
import { IAlunaOrderSchema } from '@lib/schemas/IAlunaOrderSchema'

import { ValrOrderTypeAdapter } from '../../adapters/ValrOrderTypeAdapter'
import { ValrSideAdapter } from '../../adapters/ValrSideAdapter'
import { ValrStatusAdapter } from '../../adapters/ValrStatusAdapter'
import { ValrOrderStatusEnum } from '../../enums/ValrOrderStatusEnum'
import { ValrOrderTypesEnum } from '../../enums/ValrOrderTypesEnum'
import { ValrSideEnum } from '../../enums/ValrSideEnum'
import {
  IValrOrderListSchema,
  IValrOrderGetSchema,
} from '../../schemas/IValrOrderSchema'



export class ValrOrderParser {

  static parse (params: {
    rawOrder: IValrOrderListSchema | IValrOrderGetSchema,
  }): IAlunaOrderSchema {

    const { rawOrder } = params

    const {
      orderId,
      currencyPair,
      originalQuantity,
    } = rawOrder

    let side: ValrSideEnum
    let price: string
    let status: ValrOrderStatusEnum
    let type: ValrOrderTypesEnum
    let createdAt: string

    if ((<IValrOrderListSchema> rawOrder).side) {

      ({
        side,
        price,
        status,
        type,
        createdAt,
      } = rawOrder as IValrOrderListSchema)

    } else {

      ({
        orderSide: side,
        originalPrice: price,
        orderType: type,
        orderStatusType: status,
        orderCreatedAt: createdAt,
      } = rawOrder as IValrOrderGetSchema)

    }

    const amount = parseFloat(originalQuantity)
    const rate = parseFloat(price)

    const parsedOrder: IAlunaOrderSchema = {
      id: orderId,
      symbolPair: currencyPair,
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
