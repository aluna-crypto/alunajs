import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaOrderParseParams,
  IAlunaOrderParseReturns,
} from '../../../../../lib/modules/authed/IAlunaOrderModule'
import { IAlunaOrderSchema } from '../../../../../lib/schemas/IAlunaOrderSchema'
import { translateSymbolId } from '../../../../../utils/mappings/translateSymbolId'
import { IPoloniexOrderSchema } from '../../../schemas/IPoloniexOrderSchema'



// const log = debug('@alunajs:poloniex/order/parse')



export const parse = (exchange: IAlunaExchangeAuthed) => (
  params: IAlunaOrderParseParams<IPoloniexOrderSchema>,
): IAlunaOrderParseReturns => {

  // log('parse order', params)

  const { rawOrder } = params

  const { baseCurrency, quoteCurrency } = rawOrder

  const baseSymbolId = translateSymbolId({
    exchangeSymbolId: baseCurrency,
    symbolMappings: exchange.settings.symbolMappings,
  })

  const quoteSymbolId = translateSymbolId({
    exchangeSymbolId: quoteCurrency,
    symbolMappings: exchange.settings.symbolMappings,
  })

  const order: IAlunaOrderSchema = {
    id: rawOrder.orderNumber,
    symbolPair: rawOrder.currencyPair,
    exchangeId: exchange.specs.id,
    baseSymbolId,
    quoteSymbolId,
    // total: rawOrder.total,
    // amount: rawOrder.amount,
    // account: AlunaAccountEnum.MARGIN,
    // status: rawOrder.status,
    // side: rawOrder.side,
    meta: rawOrder,
  } as any // TODO: Remove casting to any

  return { order }

}
