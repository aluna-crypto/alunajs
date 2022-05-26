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
import { translateOrderSideToAluna } from '../../../enums/adapters/ftxOrderSideAdapter'
import { translateOrderStatusToAluna } from '../../../enums/adapters/ftxOrderStatusAdapter'
import { translateOrderTypeToAluna } from '../../../enums/adapters/ftxOrderTypeAdapter'
import {
  IFtxOrderSchema,
  IFtxTriggerOrderSchema,
} from '../../../schemas/IFtxOrderSchema'
import { splitFtxSymbolPair } from '../../public/market/helpers/splitFtxSymbolPair'



export const parse = (exchange: IAlunaExchangeAuthed) => (
  params: IAlunaOrderParseParams<IFtxOrderSchema | IFtxTriggerOrderSchema>,
): IAlunaOrderParseReturns => {


  const { rawOrder } = params

  const {
    side,
    price,
    type,
    status,
    createdAt,
    id,
    market,
    size,
    filledSize,
    avgFillPrice,
    future,
  } = rawOrder

  const {
    orderPrice,
    // trailStart,
    // trailValue,
    triggerPrice,
    // triggeredAt,
    orderType,
    // retryUntilFilled,
  } = rawOrder as IFtxTriggerOrderSchema

  let {
    baseSymbolId,
    quoteSymbolId,
  } = splitFtxSymbolPair({ market })

  baseSymbolId = translateSymbolId({
    exchangeSymbolId: baseSymbolId,
    symbolMappings: exchange.settings.symbolMappings,
  })

  quoteSymbolId = translateSymbolId({
    exchangeSymbolId: quoteSymbolId,
    symbolMappings: exchange.settings.symbolMappings,
  })

  const computedType = translateOrderTypeToAluna({
    type,
    orderType,
  })

  const computedOrderSide = translateOrderSideToAluna({
    from: side,
  })

  const computedOrderStatus = translateOrderStatusToAluna({
    status,
    size,
    filledSize,
  })


  let total: number | undefined
  let rate: number | undefined
  let limitRate: number | undefined
  let stopRate: number | undefined

  switch (computedType) {

    case AlunaOrderTypesEnum.LIMIT:
      rate = price!
      total = size * rate
      break

    case AlunaOrderTypesEnum.STOP_MARKET:
      stopRate = triggerPrice!
      total = size * stopRate
      break

    case AlunaOrderTypesEnum.STOP_LIMIT:
      limitRate = orderPrice!
      stopRate = triggerPrice!
      total = size * stopRate
      break

    // Market orders
    default:
      rate = avgFillPrice!
      total = size * rate

  }

  const account = future
    ? AlunaAccountEnum.DERIVATIVES
    : AlunaAccountEnum.SPOT

  let canceledAt: Date | undefined
  let filledAt: Date | undefined

  const isCanceled = computedOrderStatus === AlunaOrderStatusEnum.CANCELED
  const isFilled = computedOrderStatus === AlunaOrderStatusEnum.FILLED

  if (isCanceled) {

    canceledAt = new Date()

  }

  if (isFilled) {

    filledAt = new Date()

  }

  const order: IAlunaOrderSchema = {
    id: id.toString(),
    symbolPair: market,
    exchangeId: exchange.specs.id,
    baseSymbolId,
    quoteSymbolId,
    amount: size,
    rate,
    total,
    account,
    side: computedOrderSide,
    status: computedOrderStatus,
    type: computedType,
    placedAt: new Date(createdAt),
    canceledAt,
    filledAt,
    meta: rawOrder,
    limitRate,
    stopRate,
  }

  return { order }

}
