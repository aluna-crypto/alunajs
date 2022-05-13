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
import { translateOrderSideToAluna } from '../../../enums/adapters/bitmexOrderSideAdapter'
import { translateOrderStatusToAluna } from '../../../enums/adapters/bitmexOrderStatusAdapter'
import { translateOrderTypeToAluna } from '../../../enums/adapters/bitmexOrderTypeAdapter'
import { IBitmexOrderSchema } from '../../../schemas/IBitmexOrderSchema'
import { assembleUiCustomDisplay } from './helpers/assembleUiCustomDisplay'
import { computeOrderAmount } from './helpers/computeOrderAmount'
import { computeOrderTotal } from './helpers/computeOrderTotal'



export const parse = (exchange: IAlunaExchangeAuthed) => (
  params: IAlunaOrderParseParams<IBitmexOrderSchema>,
): IAlunaOrderParseReturns => {

  const { rawOrder } = params

  const {
    market,
    bitmexOrder,
  } = rawOrder

  const {
    symbol,
    orderID,
    orderQty,
    ordStatus,
    side,
    price,
    stopPx,
    ordType,
    transactTime,
    timestamp,
    triggered,
  } = bitmexOrder

  const {
    baseSymbolId,
    quoteSymbolId,
  } = market

  const instrument = market.instrument!

  const computedStatus = translateOrderStatusToAluna({
    from: ordStatus,
  })

  const computedSide = translateOrderSideToAluna({
    from: side,
  })

  const computedType = translateOrderTypeToAluna({
    from: ordType,
  })

  const triggerStatus = triggered === ''
    ? AlunaOrderTriggerStatusEnum.UNTRIGGERED
    : AlunaOrderTriggerStatusEnum.TRIGGERED

  let rate: number | undefined
  let stopRate: number | undefined
  let limitRate: number | undefined

  let computedPrice: number

  switch (computedType) {

    case AlunaOrderTypesEnum.STOP_MARKET:
      stopRate = stopPx!
      computedPrice = stopPx!
      break

    case AlunaOrderTypesEnum.STOP_LIMIT:
      stopRate = stopPx!
      limitRate = price!
      computedPrice = limitRate
      break

    // 'Limit' and 'Market'
    default:
      rate = price!
      computedPrice = rate

  }

  const { amount } = computeOrderAmount({
    orderQty,
    instrument,
    computedPrice,
  })

  const { total } = computeOrderTotal({
    instrument,
    orderQty,
    computedPrice,
    computedAmount: amount,
  })

  const placedAt = new Date(transactTime)
  const computedTimeStamp = new Date(timestamp)

  let filledAt: Date | undefined
  let canceledAt: Date | undefined

  if (computedStatus === AlunaOrderStatusEnum.FILLED) {

    filledAt = computedTimeStamp

  } else if (computedStatus === AlunaOrderStatusEnum.CANCELED) {

    canceledAt = computedTimeStamp

  }

  const { uiCustomDisplay } = assembleUiCustomDisplay({
    instrument,
    bitmexOrder,
    computedAmount: amount,
    computedPrice,
    computedTotal: total,
  })

  const order: IAlunaOrderSchema = {
    id: orderID,
    symbolPair: symbol,
    baseSymbolId,
    quoteSymbolId,
    exchangeId: exchange.id,
    account: AlunaAccountEnum.DERIVATIVES,
    type: computedType,
    amount,
    total,
    status: computedStatus,
    side: computedSide,
    rate,
    stopRate,
    limitRate,
    uiCustomDisplay,
    placedAt,
    filledAt,
    canceledAt,
    triggerStatus,
    meta: bitmexOrder,
  }

  return { order }

}
