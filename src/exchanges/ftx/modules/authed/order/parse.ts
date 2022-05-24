import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import { AlunaAccountEnum } from '../../../../../lib/enums/AlunaAccountEnum'
import { AlunaOrderStatusEnum } from '../../../../../lib/enums/AlunaOrderStatusEnum'
import {
  IAlunaOrderParseParams,
  IAlunaOrderParseReturns,
} from '../../../../../lib/modules/authed/IAlunaOrderModule'
import { IAlunaOrderSchema } from '../../../../../lib/schemas/IAlunaOrderSchema'
import { translateSymbolId } from '../../../../../utils/mappings/translateSymbolId'
import { translateOrderSideToAluna } from '../../../enums/adapters/ftxOrderSideAdapter'
import { translateOrderStatusToAluna } from '../../../enums/adapters/ftxOrderStatusAdapter'
import { translateOrderTypeToAluna } from '../../../enums/adapters/ftxOrderTypeAdapter'
import { IFtxOrderSchema } from '../../../schemas/IFtxOrderSchema'



export const parse = (exchange: IAlunaExchangeAuthed) => (
  params: IAlunaOrderParseParams<IFtxOrderSchema>,
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
  } = rawOrder

  let [
    baseSymbolId,
    quoteSymbolId,
  ] = market.split('/')

  baseSymbolId = translateSymbolId({
    exchangeSymbolId: baseSymbolId,
    symbolMappings: exchange.settings.symbolMappings,
  })

  quoteSymbolId = translateSymbolId({
    exchangeSymbolId: quoteSymbolId,
    symbolMappings: exchange.settings.symbolMappings,
  })

  let total = size
  let orderPrice: number | undefined

  if (price) {

    orderPrice = price
    total = size * price

  }

  if (avgFillPrice) {

    orderPrice = avgFillPrice
    total = size * avgFillPrice

  }

  const orderType = translateOrderTypeToAluna({
    from: type,
  })

  const orderSide = translateOrderSideToAluna({
    from: side,
  })

  const orderStatus = translateOrderStatusToAluna({
    from: status,
    size,
    filledSize,
  })

  let canceledAt: Date | undefined
  let filledAt: Date | undefined

  const isCanceled = orderStatus === AlunaOrderStatusEnum.CANCELED
  const isFilled = orderStatus === AlunaOrderStatusEnum.FILLED

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
    rate: orderPrice,
    total,
    account: AlunaAccountEnum.SPOT,
    side: orderSide,
    status: orderStatus,
    type: orderType,
    placedAt: new Date(createdAt),
    canceledAt,
    filledAt,
    meta: rawOrder,
  }

  return { order }

}
