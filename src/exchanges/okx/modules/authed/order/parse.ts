import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaOrderParseParams,
  IAlunaOrderParseReturns,
} from '../../../../../lib/modules/authed/IAlunaOrderModule'
import { IAlunaOrderSchema } from '../../../../../lib/schemas/IAlunaOrderSchema'
import { translateSymbolId } from '../../../../../utils/mappings/translateSymbolId'
import { IOkxOrderSchema } from '../../../schemas/IOkxOrderSchema'



export const parse = (exchange: IAlunaExchangeAuthed) => (
  params: IAlunaOrderParseParams<IOkxOrderSchema>,
): IAlunaOrderParseReturns => {


  const { rawOrder } = params

  const { symbol } = rawOrder

  let [
    baseSymbolId,
    quoteSymbolId,
  ] = symbol.split('/')

  baseSymbolId = translateSymbolId({
    exchangeSymbolId: baseSymbolId,
    symbolMappings: exchange.settings.symbolMappings,
  })

  quoteSymbolId = translateSymbolId({
    exchangeSymbolId: quoteSymbolId,
    symbolMappings: exchange.settings.symbolMappings,
  })

  // TODO: Implement proper parser
  const order: IAlunaOrderSchema = {
    id: rawOrder.id,
    symbolPair: rawOrder.id,
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