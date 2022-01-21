import {
  AlunaOrderStatusEnum,
  AlunaOrderTypesEnum,
} from '../../../..'
import { AlunaAccountEnum } from '../../../../lib/enums/AlunaAccountEnum'
import { IAlunaOrderSchema } from '../../../../lib/schemas/IAlunaOrderSchema'
import { ValrOrderTypeAdapter } from '../../enums/adapters/ValrOrderTypeAdapter'
import { ValrSideAdapter } from '../../enums/adapters/ValrSideAdapter'
import { ValrStatusAdapter } from '../../enums/adapters/ValrStatusAdapter'
import { ValrOrderStatusEnum } from '../../enums/ValrOrderStatusEnum'
import { ValrOrderTypesEnum } from '../../enums/ValrOrderTypesEnum'
import { ValrSideEnum } from '../../enums/ValrSideEnum'
import { Valr } from '../../Valr'
import { IValrCurrencyPairs } from '../IValrMarketSchema'
import {
  IValrOrderGetSchema,
  IValrOrderListSchema,
} from '../IValrOrderSchema'



export class ValrOrderParser {

  static parse (params: {
    rawOrder: IValrOrderListSchema | IValrOrderGetSchema,
    currencyPair: IValrCurrencyPairs,
  }): IAlunaOrderSchema {

    const {
      rawOrder,
      currencyPair,
    } = params

    const {
      orderId,
      stopPrice,
      originalQuantity,
    } = rawOrder

    const {
      symbol,
      baseCurrency,
      quoteCurrency,
    } = currencyPair

    let side: ValrSideEnum
    let price: string
    let status: ValrOrderStatusEnum
    let type: ValrOrderTypesEnum
    let createdAt: string
    let updatedAt: string

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
        updatedAt,
      } = rawOrder as IValrOrderListSchema)

    } else {

      ({
        orderSide: side,
        originalPrice: price,
        orderType: type,
        orderStatusType: status,
        orderCreatedAt: createdAt,
        orderUpdatedAt: updatedAt,
      } = rawOrder as IValrOrderGetSchema)

    }

    const exchangeId = Valr.ID

    const alnOrderType = ValrOrderTypeAdapter.translateToAluna({ from: type })

    let rate: number | undefined
    let stopRate: number | undefined
    let limitRate: number | undefined

    switch (alnOrderType) {

      case AlunaOrderTypesEnum.STOP_LIMIT:
      case AlunaOrderTypesEnum.TAKE_PROFIT_LIMIT:

        stopRate = Number(stopPrice)
        limitRate = Number(price)

        break

      default:

        rate = Number(price)

    }

    const amount = Number(originalQuantity)

    const alnOrderStatus = ValrStatusAdapter.translateToAluna({ from: status })

    let filledAt: Date | undefined
    let canceledAt: Date | undefined

    if (alnOrderStatus === AlunaOrderStatusEnum.FILLED) {

      filledAt = new Date(updatedAt)

    } else if (alnOrderStatus === AlunaOrderStatusEnum.CANCELED) {

      canceledAt = new Date(updatedAt)

    }

    const parsedOrder: IAlunaOrderSchema = {
      id: orderId,
      symbolPair: symbol,
      exchangeId,
      baseSymbolId: baseCurrency,
      quoteSymbolId: quoteCurrency,
      total: amount * Number(price),
      amount,
      rate,
      stopRate,
      limitRate,
      account: AlunaAccountEnum.EXCHANGE,
      side: ValrSideAdapter.translateToAluna({ from: side }),
      status: alnOrderStatus,
      type: alnOrderType,
      placedAt: new Date(createdAt),
      filledAt,
      canceledAt,
      meta: rawOrder,
    }

    return parsedOrder

  }

}
