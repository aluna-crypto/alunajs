import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import { AlunaAccountEnum } from '../../../../../lib/enums/AlunaAccountEnum'
import { AlunaOrderStatusEnum } from '../../../../../lib/enums/AlunaOrderStatusEnum'
import {
  IAlunaOrderParseParams,
  IAlunaOrderParseReturns,
} from '../../../../../lib/modules/authed/IAlunaOrderModule'
import { IAlunaOrderSchema } from '../../../../../lib/schemas/IAlunaOrderSchema'
import { translateSymbolId } from '../../../../../utils/mappings/translateSymbolId'
import { translateOrderSideToAluna } from '../../../enums/adapters/huobiOrderSideAdapter'
import { translateOrderStatusToAluna } from '../../../enums/adapters/huobiOrderStatusAdapter'
import { translateOrderTypeToAluna } from '../../../enums/adapters/huobiOrderTypeAdapter'
import { HuobiOrderSideEnum } from '../../../enums/HuobiOrderSideEnum'
import { HuobiOrderTypeEnum } from '../../../enums/HuobiOrderTypeEnum'
import { IHuobiOrderResponseSchema } from '../../../schemas/IHuobiOrderSchema'



export const parse = (exchange: IAlunaExchangeAuthed) => (
  params: IAlunaOrderParseParams<IHuobiOrderResponseSchema>,
): IAlunaOrderParseReturns => {


  const { rawOrder: rawOrderResponse } = params

  const {
    rawOrder,
    rawSymbol,
  } = rawOrderResponse

  const {
    symbol,
    price,
    type,
    'created-at': createdAt,
    amount,
    state,
    id,
  } = rawOrder

  let {
    bc: baseSymbolId,
    qc: quoteSymbolId,
  } = rawSymbol

  const {
    settings,
    id: exchangeId,
  } = exchange

  const { symbolMappings } = settings

  baseSymbolId = translateSymbolId({
    exchangeSymbolId: baseSymbolId,
    symbolMappings,
  })

  quoteSymbolId = translateSymbolId({
    exchangeSymbolId: quoteSymbolId,
    symbolMappings,
  })

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
  const translatedOrderSide = translateOrderSideToAluna({
    from: orderSide,
  })
  const translatedOrderType = translateOrderTypeToAluna({
    from: orderType,
  })
  const orderAmount = Number(amount)
  const rate = Number(price)
  const total = orderAmount * rate

  const order: IAlunaOrderSchema = {
    id: id.toString(),
    symbolPair: symbol,
    account: AlunaAccountEnum.SPOT,
    exchangeId,
    baseSymbolId,
    quoteSymbolId,
    total,
    placedAt,
    canceledAt,
    filledAt,
    rate,
    amount: orderAmount,
    side: translatedOrderSide,
    status: orderStatus,
    type: translatedOrderType,
    meta: rawOrder,
  }

  return { order }

}
