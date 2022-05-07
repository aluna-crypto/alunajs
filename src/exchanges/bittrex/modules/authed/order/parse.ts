import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import { AlunaAccountEnum } from '../../../../../lib/enums/AlunaAccountEnum'
import { AlunaOrderStatusEnum } from '../../../../../lib/enums/AlunaOrderStatusEnum'
import {
  IAlunaOrderParseParams,
  IAlunaOrderParseReturns,
} from '../../../../../lib/modules/authed/IAlunaOrderModule'
import { IAlunaOrderSchema } from '../../../../../lib/schemas/IAlunaOrderSchema'
import { translateSymbolId } from '../../../../../utils/mappings/translateSymbolId'
import { bittrexBaseSpecs } from '../../../bittrexSpecs'
import { translateOrderSideToAluna } from '../../../enums/adapters/bittrexOrderSideAdapter'
import { translateOrderStatusToAluna } from '../../../enums/adapters/bittrexOrderStatusAdapter'
import { translateOrderTypeToAluna } from '../../../enums/adapters/bittrexOrderTypeAdapter'
import { BittrexOrderStatusEnum } from '../../../enums/BittrexOrderStatusEnum'
import { IBittrexOrderSchema } from '../../../schemas/IBittrexOrderSchema'



// const log = debug('@alunajs:bittrex/order/parse')



export const parse = (exchange: IAlunaExchangeAuthed) => (
  params: IAlunaOrderParseParams<IBittrexOrderSchema>,
): IAlunaOrderParseReturns => {

  // log('params', params)

  const { rawOrder } = params

  const exchangeId = bittrexBaseSpecs.id

  const {
    createdAt,
    direction,
    id,
    fillQuantity,
    marketSymbol,
    quantity,
    type: orderType,
    status,
    limit,
    closedAt,
    proceeds,
  } = rawOrder

  const [baseCurrency, quoteCurrency] = rawOrder.marketSymbol.split('-')

  const baseSymbolId = translateSymbolId({
    exchangeSymbolId: baseCurrency,
    symbolMappings: exchange.settings.mappings,
  })

  const quoteSymbolId = translateSymbolId({
    exchangeSymbolId: quoteCurrency,
    symbolMappings: exchange.settings.mappings,
  })

  let rate: number | undefined

  if (limit) {

    rate = parseFloat(limit)

  } else if (proceeds) {

    rate = parseFloat(proceeds)

  }

  const amount = parseFloat(quantity)
  const total = rate ? amount * rate : amount

  const orderStatus = translateOrderStatusToAluna({
    fillQuantity,
    quantity,
    from: status,
  })

  let filledAt: Date | undefined
  let canceledAt: Date | undefined

  if (orderStatus === AlunaOrderStatusEnum.FILLED) {

    filledAt = new Date(closedAt)

  }

  const isClosed = status === BittrexOrderStatusEnum.CLOSED
  const isCanceled = orderStatus === AlunaOrderStatusEnum.CANCELED
  const isPartFilled = orderStatus === AlunaOrderStatusEnum.PARTIALLY_FILLED

  if (isCanceled || (isPartFilled && isClosed)) {

    canceledAt = new Date(closedAt)

  }

  const parsedOrder: IAlunaOrderSchema = {
    id,
    symbolPair: marketSymbol,
    total,
    amount,
    rate,
    exchangeId,
    baseSymbolId,
    quoteSymbolId,
    account: AlunaAccountEnum.EXCHANGE,
    side: translateOrderSideToAluna({ from: direction }),
    status: orderStatus,
    type: translateOrderTypeToAluna({ from: orderType }),
    placedAt: new Date(createdAt),
    filledAt,
    canceledAt,
    meta: rawOrder,
  }

  return { order: parsedOrder }

}
