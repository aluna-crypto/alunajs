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
import { translateOrderSideToAluna } from '../../../enums/adapters/poloniexOrderSideAdapter'
import {
  translateOrderStatusToAluna,
  translatePoloniexOrderStatus,
} from '../../../enums/adapters/poloniexOrderStatusAdapter'
import { PoloniexOrderSideEnum } from '../../../enums/PoloniexOrderSideEnum'
import {
  IPoloniexOrderSchema,
  IPoloniexOrderStatusInfoSchema,
} from '../../../schemas/IPoloniexOrderSchema'



// const log = debug('@alunajs:poloniex/order/parse')



export const parse = (exchange: IAlunaExchangeAuthed) => (
  params: IAlunaOrderParseParams<IPoloniexOrderSchema | IPoloniexOrderStatusInfoSchema>,
): IAlunaOrderParseReturns => {

  // log('parse order', params)

  const { rawOrder } = params

  const {
    amount,
    currencyPair,
    date,
    orderNumber,
    rate,
    total,
    type,
    startingAmount,
  } = rawOrder

  const [quoteCurrency, baseCurrency] = currencyPair.split('_')

  const baseSymbolId = translateSymbolId({
    exchangeSymbolId: baseCurrency,
    symbolMappings: exchange.settings.symbolMappings,
  })

  const quoteSymbolId = translateSymbolId({
    exchangeSymbolId: quoteCurrency,
    symbolMappings: exchange.settings.symbolMappings,
  })

  const translatedPoloniexStatus = translatePoloniexOrderStatus({
    status: (rawOrder as IPoloniexOrderStatusInfoSchema).status,
    amount,
    startingAmount,
  })

  // @TODO -> need to verify type property
  const orderSide = translateOrderSideToAluna({
    from: type as unknown as PoloniexOrderSideEnum,
  })

  const orderStatus = translateOrderStatusToAluna({
    from: translatedPoloniexStatus,
  })

  const orderAmount = startingAmount
    ? Number(startingAmount)
    : Number(amount)

  let canceledAt: Date | undefined

  if (orderStatus === AlunaOrderStatusEnum.CANCELED) {

    canceledAt = new Date()

  }

  let filledAt: Date | undefined

  if (orderStatus === AlunaOrderStatusEnum.FILLED) {

    filledAt = new Date()

  }

  const order: IAlunaOrderSchema = {
    id: orderNumber,
    symbolPair: currencyPair,
    exchangeId: exchange.specs.id,
    baseSymbolId,
    quoteSymbolId,
    total: Number(total),
    amount: orderAmount,
    side: orderSide,
    status: orderStatus,
    rate: Number(rate),
    account: AlunaAccountEnum.EXCHANGE,
    placedAt: new Date(date),
    type: AlunaOrderTypesEnum.LIMIT, // Poloniex only supports LIMIT orders
    filledAt,
    canceledAt,
    meta: rawOrder,
  }

  return { order }

}
