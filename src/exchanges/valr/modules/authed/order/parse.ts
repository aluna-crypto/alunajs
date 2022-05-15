import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import { AlunaAccountEnum } from '../../../../../lib/enums/AlunaAccountEnum'
import { AlunaOrderStatusEnum } from '../../../../../lib/enums/AlunaOrderStatusEnum'
import { AlunaOrderTypesEnum } from '../../../../../lib/enums/AlunaOrderTypesEnum'
import {
  IAlunaOrderParseParams,
  IAlunaOrderParseReturns,
} from '../../../../../lib/modules/authed/IAlunaOrderModule'
import { IAlunaOrderSchema } from '../../../../../lib/schemas/IAlunaOrderSchema'
import { translateSymbolId } from '../../../../../utils/mappings/translateSymbolId'
import { translateOrderSideToAluna } from '../../../enums/adapters/valrOrderSideAdapter'
import { translateOrderStatusToAluna } from '../../../enums/adapters/valrOrderStatusAdapter'
import { translateOrderTypeToAluna } from '../../../enums/adapters/valrOrderTypeAdapter'
import { ValrOrderSideEnum } from '../../../enums/ValrOrderSideEnum'
import { ValrOrderStatusEnum } from '../../../enums/ValrOrderStatusEnum'
import { ValrOrderTypeEnum } from '../../../enums/ValrOrderTypeEnum'
import {
  IValrOrderGetSchema,
  IValrOrderListSchema,
  IValrOrderSchema,
} from '../../../schemas/IValrOrderSchema'
import { valrBaseSpecs } from '../../../valrSpecs'



export const parse = (exchange: IAlunaExchangeAuthed) => (
  params: IAlunaOrderParseParams<IValrOrderSchema>,
): IAlunaOrderParseReturns => {


  const { rawOrder } = params

  const {
    order,
    pair,
  } = rawOrder

  const {
    orderId,
    stopPrice,
    originalQuantity,
  } = order

  const {
    symbol,
    baseCurrency,
    quoteCurrency,
  } = pair

  let side: ValrOrderSideEnum
  let price: string
  let status: ValrOrderStatusEnum
  let type: ValrOrderTypeEnum
  let createdAt: string
  let updatedAt: string

  /**
   * Here we first cast rawOrder to IValrOrderListSchema and then try to
   * access the property side. Typescript allows this syntax to check if the
   * object has the desired property. If rawOrder has the side property, it
   * will be returned, otherwise, it will return undefined. This is needed
   * because rawOrder can be of 2 possible types
   */
  const isIValrOderListSchema = !!(<IValrOrderListSchema> order).side

  if (isIValrOderListSchema) {

    ({
      side,
      price,
      status,
      type,
      createdAt,
      updatedAt,
    } = order as IValrOrderListSchema)

  } else {

    ({
      orderSide: side,
      originalPrice: price,
      orderType: type,
      orderStatusType: status,
      orderCreatedAt: createdAt,
      orderUpdatedAt: updatedAt,
    } = order as IValrOrderGetSchema)

  }

  const exchangeId = valrBaseSpecs.id

  const baseSymbolId = translateSymbolId({
    exchangeSymbolId: baseCurrency,
    symbolMappings: exchange.settings.symbolMappings,
  })

  const quoteSymbolId = translateSymbolId({
    exchangeSymbolId: quoteCurrency,
    symbolMappings: exchange.settings.symbolMappings,
  })

  const alnOrderType = translateOrderTypeToAluna({ from: type })

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

  const alnOrderStatus = translateOrderStatusToAluna({ from: status })

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
    baseSymbolId,
    quoteSymbolId,
    total: amount * Number(price),
    amount,
    rate,
    stopRate,
    limitRate,
    account: AlunaAccountEnum.SPOT,
    side: translateOrderSideToAluna({ from: side }),
    status: alnOrderStatus,
    type: alnOrderType,
    placedAt: new Date(createdAt),
    filledAt,
    canceledAt,
    meta: rawOrder,
  }

  return { order: parsedOrder }

}
