import { debug } from 'debug'

import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import { AlunaAccountEnum } from '../../../../../lib/enums/AlunaAccountEnum'
import { AlunaOrderStatusEnum } from '../../../../../lib/enums/AlunaOrderStatusEnum'
import {
  IAlunaOrderParseParams,
  IAlunaOrderParseReturns,
} from '../../../../../lib/modules/authed/IAlunaOrderModule'
import { IAlunaOrderSchema } from '../../../../../lib/schemas/IAlunaOrderSchema'
import { translateSymbolId } from '../../../../../lib/utils/mappings/translateSymbolId'
import { sampleBaseSpecs } from '../../../sampleSpecs'
import { translateOrderSideToAluna } from '../../../enums/adapters/sampleOrderSideAdapter'
import { translateOrderStatusToAluna } from '../../../enums/adapters/sampleOrderStatusAdapter'
import { translateOrderTypeToAluna } from '../../../enums/adapters/sampleOrderTypeAdapter'
import { SampleOrderStatusEnum } from '../../../enums/SampleOrderStatusEnum'



const log = debug('@aluna.js:sample/order/parse')



export const parse = (exchange: IAlunaExchangeAuthed) => (
  params: IAlunaOrderParseParams,
): IAlunaOrderParseReturns => {

  log('params', params)

  const { rawOrder } = params

  const exchangeId = sampleBaseSpecs.id

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

  const isClosed = status === SampleOrderStatusEnum.CLOSED
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
