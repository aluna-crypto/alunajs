import BigNumber from 'bignumber.js'

import { AlunaAccountEnum } from '../../../../../../lib/enums/AlunaAccountEnum'
import { AlunaOrderStatusEnum } from '../../../../../../lib/enums/AlunaOrderStatusEnum'
import { AlunaOrderTriggerStatusEnum } from '../../../../../../lib/enums/AlunaOrderTriggerStatusEnum'
import { AlunaOrderTypesEnum } from '../../../../../../lib/enums/AlunaOrderTypesEnum'
import { IAlunaOrderParseReturns } from '../../../../../../lib/modules/authed/IAlunaOrderModule'
import { IAlunaOrderSchema } from '../../../../../../lib/schemas/IAlunaOrderSchema'
import { translateOrderSideToAluna } from '../../../../enums/adapters/huobiOrderSideAdapter'
import { translateOrderStatusToAluna } from '../../../../enums/adapters/huobiOrderStatusAdapter'
import { translateOrderTypeToAluna } from '../../../../enums/adapters/huobiOrderTypeAdapter'
import { HuobiOrderStatusEnum } from '../../../../enums/HuobiOrderStatusEnum'
import { IHuobiConditionalOrderSchema } from '../../../../schemas/IHuobiOrderSchema'



export interface IParseHuobiConditionalOrderParams {
  exchangeId: string
  baseSymbolId: string
  quoteSymbolId: string
  huobiConditionalOrder: IHuobiConditionalOrderSchema
}


export const parseHuobiConditionalOrder = (
  params: IParseHuobiConditionalOrderParams,
): IAlunaOrderParseReturns => {

  const {
    exchangeId,
    baseSymbolId,
    quoteSymbolId,
    huobiConditionalOrder,
  } = params

  const {
    clientOrderId,
    orderOrigTime,
    orderPrice,
    orderSide,
    orderSize,
    orderType,
    stopPrice,
    symbol,
    orderStatus,
    orderValue,
  } = huobiConditionalOrder

  const status = translateOrderStatusToAluna({
    from: orderStatus,
  })

  const type = translateOrderTypeToAluna({
    from: orderType,
  })

  const side = translateOrderSideToAluna({
    orderSide,
  })

  let stopRate
  let limitRate
  let amount
  let total

  switch (type) {

    case AlunaOrderTypesEnum.STOP_LIMIT:
      amount = Number(orderSize)
      stopRate = Number(stopPrice)
      limitRate = Number(orderPrice)
      total = amount * limitRate
      break

    default:
      stopRate = Number(stopPrice)
      amount = new BigNumber(orderValue!)
        .div(stopRate)
        .toNumber()
      total = amount * stopRate
      break
  }

  let filledAt
  let canceledAt

  if (status === AlunaOrderStatusEnum.FILLED) {

    filledAt = new Date()

  } else if (status === AlunaOrderStatusEnum.CANCELED) {

    canceledAt = new Date()

  }

  const placedAt = new Date(orderOrigTime)

  const triggerStatus = orderStatus === HuobiOrderStatusEnum.TRIGGERED
    ? AlunaOrderTriggerStatusEnum.TRIGGERED
    : AlunaOrderTriggerStatusEnum.UNTRIGGERED

  const order: IAlunaOrderSchema = {
    id: clientOrderId,
    clientOrderId,
    symbolPair: symbol,
    account: AlunaAccountEnum.SPOT,
    exchangeId,
    baseSymbolId,
    quoteSymbolId,
    placedAt,
    stopRate,
    limitRate,
    amount,
    total,
    side,
    status,
    type,
    triggerStatus,
    filledAt,
    canceledAt,
    meta: huobiConditionalOrder,
  }

  return { order }

}
