import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import { AlunaAccountEnum } from '../../../../../lib/enums/AlunaAccountEnum'
import { AlunaOrderStatusEnum } from '../../../../../lib/enums/AlunaOrderStatusEnum'
import {
  IAlunaOrderParseParams,
  IAlunaOrderParseReturns,
} from '../../../../../lib/modules/authed/IAlunaOrderModule'
import { IAlunaOrderSchema } from '../../../../../lib/schemas/IAlunaOrderSchema'
import { translateSymbolId } from '../../../../../utils/mappings/translateSymbolId'
import { translateOrderSideToAluna } from '../../../enums/adapters/gateOrderSideAdapter'
import { translateOrderStatusToAluna } from '../../../enums/adapters/gateOrderStatusAdapter'
import { translateOrderTypeToAluna } from '../../../enums/adapters/gateOrderTypeAdapter'
import { gateBaseSpecs } from '../../../gateSpecs'
import { IGateOrderSchema } from '../../../schemas/IGateOrderSchema'



// const log = debug('@alunajs:gate/order/parse')



export const parse = (exchange: IAlunaExchangeAuthed) => (
  params: IAlunaOrderParseParams<IGateOrderSchema>,
): IAlunaOrderParseReturns => {

  // log('params', params)

  const { rawOrder } = params

  const {
    id,
    type: orderType,
    status,
    amount: quantity,
    currency_pair: currencyPair,
    side,
    price,
    create_time_ms: createdTime,
    update_time_ms: updatedTime,
    left,
  } = rawOrder

  const exchangeId = gateBaseSpecs.id

  const amount = Number(quantity)
  const leftToFill = Number(left)
  const rate = Number(price)
  const total = amount * rate
  const createdAt = new Date(createdTime)
  const [baseCurrency, quoteCurrency] = currencyPair.split('_')

  const baseSymbolId = translateSymbolId({
    exchangeSymbolId: baseCurrency,
    symbolMappings: exchange.settings.symbolMappings,
  })

  const quoteSymbolId = translateSymbolId({
    exchangeSymbolId: quoteCurrency,
    symbolMappings: exchange.settings.symbolMappings,
  })

  const orderStatus = translateOrderStatusToAluna({
    from: status, leftToFill, amount,
  })

  const orderSide = translateOrderSideToAluna({ from: side })

  const type = translateOrderTypeToAluna({ from: orderType })

  let filledAt: Date | undefined
  let canceledAt: Date | undefined

  if (orderStatus === AlunaOrderStatusEnum.FILLED) {

    filledAt = new Date(updatedTime)

  }

  if (orderStatus === AlunaOrderStatusEnum.CANCELED) {

    canceledAt = new Date(updatedTime)

  }

  const parsedOrder: IAlunaOrderSchema = {
    id,
    symbolPair: currencyPair,
    total,
    amount,
    rate,
    exchangeId,
    baseSymbolId,
    quoteSymbolId,
    account: AlunaAccountEnum.EXCHANGE,
    side: orderSide,
    status: orderStatus,
    type,
    placedAt: new Date(createdAt),
    filledAt,
    canceledAt,
    meta: rawOrder,
  }

  return { order: parsedOrder }

}
