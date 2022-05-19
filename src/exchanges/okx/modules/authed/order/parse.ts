import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import { AlunaAccountEnum } from '../../../../../lib/enums/AlunaAccountEnum'
import { AlunaOrderStatusEnum } from '../../../../../lib/enums/AlunaOrderStatusEnum'
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
    ccy,
    tgtCcy,
  } = rawOrder

  const baseSymbolId = translateSymbolId({
    exchangeSymbolId: ccy,
    symbolMappings: exchange.settings.symbolMappings,
  })

  const quoteSymbolId = translateSymbolId({
    exchangeSymbolId: tgtCcy,
    symbolMappings: exchange.settings.symbolMappings,
  })

  const updatedAt = uTime ? new Date(Number(uTime)) : undefined
  const amount = Number(sz)
  const rate = Number(px)
  const total = amount * rate

  const orderStatus = translateOrderStatusToAluna({ from: state })
  const orderSide = translateOrderSideToAluna({ from: side })
  const orderType = translateOrderTypeToAluna({ from: ordType })

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
    id: ordId,
    symbolPair: instId,
    exchangeId: exchange.specs.id,
    baseSymbolId,
    quoteSymbolId,
    total,
    amount,
    placedAt: new Date(createdAt),
    canceledAt,
    filledAt,
    rate,
    account: AlunaAccountEnum.SPOT,
    type: orderType,
    status: orderStatus,
    side: orderSide,
    meta: rawOrder,
  }

  return { order }

}
