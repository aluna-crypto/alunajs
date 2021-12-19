import { AlunaAccountEnum } from '../../../../lib/enums/AlunaAccountEnum'
import { IAlunaOrderSchema } from '../../../../lib/schemas/IAlunaOrderSchema'
import { ValrOrderTypeAdapter } from '../../enums/adapters/ValrOrderTypeAdapter'
import { ValrSideAdapter } from '../../enums/adapters/ValrSideAdapter'
import { ValrStatusAdapter } from '../../enums/adapters/ValrStatusAdapter'
import { ValrOrderStatusEnum } from '../../enums/ValrOrderStatusEnum'
import { ValrOrderTypesEnum } from '../../enums/ValrOrderTypesEnum'
import { ValrSideEnum } from '../../enums/ValrSideEnum'
import { Valr } from '../../Valr'
import {
  IValrOrderGetSchema,
  IValrOrderListSchema,
} from '../IValrOrderSchema'



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

    /**
     * Here we first cast rawOrder to IValrOrderListSchema and then try to
     * access the property side. Typescript allows this syntax to check if the
     * object has the desired property. If rawOrder has the side property, it
     * will be returned, otherwise, it will return undefined. This is needed
     * because rawOrder can be of 2 possible types
     */
    const isIValrOderListSchema = !!(<IValrOrderListSchema> rawOrder).side

    if (isIValrOderListSchema) {

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

    const [baseSymbolId, quoteSymbolId] = [
      currencyPair.slice(0, 3),
      currencyPair.slice(3),
    ]

    const parsedOrder: IAlunaOrderSchema = {
      id: orderId,
      exchangeId: Valr.ID,
      symbolPair: currencyPair,
      baseSymbolId,
      quoteSymbolId,
      total: amount * rate,
      amount,
      isAmountInContracts: false,
      rate,
      account: AlunaAccountEnum.EXCHANGE,
      side: ValrSideAdapter.translateToAluna({ from: side }),
      status: ValrStatusAdapter.translateToAluna({ from: status }),
      type: ValrOrderTypeAdapter.translateToAluna({ from: type }),
      placedAt: new Date(createdAt),
      meta: rawOrder,
    }

    return parsedOrder

  }

}
