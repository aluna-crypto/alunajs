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
import { translateOrderSideToAluna } from '../../../enums/adapters/okxOrderSideAdapter'
import { translateOrderStatusToAluna } from '../../../enums/adapters/okxOrderStatusAdapter'
import { translateOrderTypeToAluna } from '../../../enums/adapters/okxOrderTypeAdapter'
import { IOkxOrderSchema } from '../../../schemas/IOkxOrderSchema'



export const parse = (exchange: IAlunaExchangeAuthed) => (
  params: IAlunaOrderParseParams<IOkxOrderSchema>,
): IAlunaOrderParseReturns => {


  const { rawOrder } = params

  const {
    side,
    cTime,
    instId,
    ordId,
    px,
    state,
    sz,
    uTime,
    ordType,
    slOrdPx,
    slTriggerPx,
    algoId,
  } = rawOrder

  let [baseSymbolId, quoteSymbolId] = instId.split('-')

  baseSymbolId = translateSymbolId({
    exchangeSymbolId: baseSymbolId,
    symbolMappings: exchange.settings.symbolMappings,
  })

  quoteSymbolId = translateSymbolId({
    exchangeSymbolId: quoteSymbolId,
    symbolMappings: exchange.settings.symbolMappings,
  })

  const updatedAt = uTime ? new Date(Number(uTime)) : new Date()
  const amount = Number(sz)
  const orderStatus = translateOrderStatusToAluna({ from: state })
  const orderSide = translateOrderSideToAluna({ from: side })
  const orderType = translateOrderTypeToAluna({ from: ordType, slOrdPx })

  const priceFields = {
    total: amount,
  }

  let id = ordId

  switch (orderType) {

    case AlunaOrderTypesEnum.STOP_LIMIT:
      Object.assign(priceFields, {
        stopRate: Number(slOrdPx),
        limitRate: Number(slTriggerPx),
        total: Number(slTriggerPx) * amount,
      })

      id = algoId
      break

    case AlunaOrderTypesEnum.STOP_MARKET:
      Object.assign(priceFields, {
        stopRate: Number(slTriggerPx),
        total: Number(slTriggerPx) * amount,
      })

      id = algoId
      break

    case AlunaOrderTypesEnum.MARKET:
      Object.assign(priceFields, {
        total: amount,
      })

      id = algoId
      break

    default:
      Object.assign(priceFields, {
        rate: Number(px),
        total: Number(px) * amount,
      })
      break

  }


  let createdAt: Date
  let filledAt: Date | undefined
  let canceledAt: Date | undefined

  if (cTime) {

    createdAt = new Date(Number(cTime))

  } else {

    createdAt = new Date()

  }

  if (orderStatus === AlunaOrderStatusEnum.CANCELED) {

    canceledAt = updatedAt

  }

  if (orderStatus === AlunaOrderStatusEnum.FILLED) {

    filledAt = updatedAt

  }

  const order: IAlunaOrderSchema = {
    id,
    symbolPair: instId,
    exchangeId: exchange.specs.id,
    baseSymbolId,
    quoteSymbolId,
    amount,
    placedAt: new Date(createdAt),
    canceledAt,
    filledAt,
    ...priceFields,
    account: AlunaAccountEnum.SPOT,
    type: orderType,
    status: orderStatus,
    side: orderSide,
    meta: rawOrder,
  }

  return { order }

}
