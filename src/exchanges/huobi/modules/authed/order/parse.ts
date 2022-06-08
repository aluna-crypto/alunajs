import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import { AlunaAccountEnum } from '../../../../../lib/enums/AlunaAccountEnum'
import { AlunaOrderStatusEnum } from '../../../../../lib/enums/AlunaOrderStatusEnum'
import { AlunaOrderTriggerStatusEnum } from '../../../../../lib/enums/AlunaOrderTriggerStatusEnum'
import { AlunaOrderTypesEnum } from '../../../../../lib/enums/AlunaOrderTypesEnum'
import {
  IAlunaOrderParseParams,
  IAlunaOrderParseReturns,
} from '../../../../../lib/modules/authed/IAlunaOrderModule'
import { IAlunaOrderSchema } from '../../../../../lib/schemas/IAlunaOrderSchema'
import { translateSymbolId } from '../../../../../utils/mappings/translateSymbolId'
import { translateConditionalOrderTypeToAluna } from '../../../enums/adapters/huobiConditionalOrderTypeAdapter'
import { translateOrderSideToAluna } from '../../../enums/adapters/huobiOrderSideAdapter'
import { translateOrderStatusToAluna } from '../../../enums/adapters/huobiOrderStatusAdapter'
import { translateOrderTypeToAluna } from '../../../enums/adapters/huobiOrderTypeAdapter'
import { HuobiOrderSideEnum } from '../../../enums/HuobiOrderSideEnum'
import { HuobiOrderTypeEnum } from '../../../enums/HuobiOrderTypeEnum'
import {
  IHuobiOrderPriceFieldsSchema,
  IHuobiOrderResponseSchema,
  IHuobiOrderSchema,
  IHuobiOrderTriggerSchema,
} from '../../../schemas/IHuobiOrderSchema'



export const parse = (exchange: IAlunaExchangeAuthed) => (
  params: IAlunaOrderParseParams<IHuobiOrderResponseSchema>,
): IAlunaOrderParseReturns => {


  const { rawOrder: rawOrderResponse } = params

  const {
    rawOrder,
    rawSymbol,
  } = rawOrderResponse

  const {
    settings,
    id: exchangeId,
  } = exchange

  const { symbolMappings } = settings

  let {
    bc: baseSymbolId,
    qc: quoteSymbolId,
  } = rawSymbol

  baseSymbolId = translateSymbolId({
    exchangeSymbolId: baseSymbolId,
    symbolMappings,
  })

  quoteSymbolId = translateSymbolId({
    exchangeSymbolId: quoteSymbolId,
    symbolMappings,
  })


  const isIHuobiOrderSchema = !!(<IHuobiOrderSchema> rawOrder).id

  if (isIHuobiOrderSchema) {

    const {
      symbol,
      price,
      type,
      'created-at': createdAt,
      amount,
      state,
      'stop-price': stopPrice,
      id,
    } = rawOrder as IHuobiOrderSchema

    const orderStatus = translateOrderStatusToAluna({
      from: state,
    })

    const placedAt = new Date(createdAt)
    let filledAt: Date | undefined
    let canceledAt: Date | undefined

    if (orderStatus === AlunaOrderStatusEnum.CANCELED) {

      canceledAt = new Date()

    }

    if (orderStatus === AlunaOrderStatusEnum.FILLED) {

      filledAt = new Date()

    }

    const orderSide = type.split('-')[0] as HuobiOrderSideEnum
    const orderType = type.split('-')[1] as HuobiOrderTypeEnum
    const orderTypeSecondArgument = type.split('-')[2] as HuobiOrderTypeEnum

    const formattedRawOrderType = orderTypeSecondArgument ? `${orderType}-${orderTypeSecondArgument}` as HuobiOrderTypeEnum : orderType

    const translatedOrderSide = translateOrderSideToAluna({
      from: orderSide,
    })

    const translatedOrderType = translateOrderTypeToAluna({
      from: formattedRawOrderType,
    })

    const orderAmount = Number(amount)
    const rate = Number(price)
    const total = orderAmount * rate

    const orderPrices: IHuobiOrderPriceFieldsSchema = {
      total,
    }

    switch (translatedOrderType) {

      case AlunaOrderTypesEnum.STOP_LIMIT:
        orderPrices.limitRate = rate
        orderPrices.stopRate = Number(stopPrice)
        break

      case AlunaOrderTypesEnum.STOP_MARKET:
        orderPrices.stopRate = Number(stopPrice)
        orderPrices.total = orderAmount
        break

      case AlunaOrderTypesEnum.MARKET:
        orderPrices.total = orderAmount
        break

      default:
        orderPrices.rate = rate
        break
    }


    const order: IAlunaOrderSchema = {
      id: id.toString(),
      symbolPair: symbol,
      account: AlunaAccountEnum.SPOT,
      exchangeId,
      baseSymbolId,
      quoteSymbolId,
      placedAt,
      canceledAt,
      filledAt,
      amount: orderAmount,
      ...orderPrices,
      side: translatedOrderSide,
      status: orderStatus,
      type: translatedOrderType,
      meta: rawOrder,
    }

    return { order }

  }

  const {
    clientOrderId,
    orderOrigTime,
    orderPrice,
    orderSide,
    orderSize,
    orderType,
    stopPrice,
    symbol,
  } = rawOrder as IHuobiOrderTriggerSchema

  // trigger orders are always open
  const status = AlunaOrderStatusEnum.OPEN

  const orderAmount = Number(orderSize)
  const rate = Number(orderPrice)
  const total = orderAmount * rate
  const type = translateConditionalOrderTypeToAluna({
    from: orderType,
  })

  const translatedOrderSide = translateOrderSideToAluna({
    from: orderSide,
  })

  const placedAt = new Date(orderOrigTime)

  const order: IAlunaOrderSchema = {
    id: clientOrderId,
    clientOrderId,
    symbolPair: symbol,
    account: AlunaAccountEnum.SPOT,
    exchangeId,
    baseSymbolId,
    quoteSymbolId,
    placedAt,
    total,
    rate,
    stopRate: Number(stopPrice),
    amount: orderAmount,
    side: translatedOrderSide,
    status,
    triggerStatus: AlunaOrderTriggerStatusEnum.UNTRIGGERED,
    type,
    meta: rawOrder,
  }

  return { order }

}
