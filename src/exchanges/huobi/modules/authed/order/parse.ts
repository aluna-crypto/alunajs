import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaOrderParseParams,
  IAlunaOrderParseReturns,
} from '../../../../../lib/modules/authed/IAlunaOrderModule'
import { IAlunaOrderSchema } from '../../../../../lib/schemas/IAlunaOrderSchema'
import { translateSymbolId } from '../../../../../utils/mappings/translateSymbolId'
import {
  IHuobiConditionalOrderSchema,
  IHuobiOrderResponseSchema,
  IHuobiOrderSchema,
} from '../../../schemas/IHuobiOrderSchema'
import { parseHuobiConditionalOrder } from './helpers/parseHuobiConditionalOrder'
import { parseHuobiOrder } from './helpers/parseHuobiOrder'



export const parse = (exchange: IAlunaExchangeAuthed) => (
  params: IAlunaOrderParseParams<IHuobiOrderResponseSchema>,
): IAlunaOrderParseReturns => {


  const { rawOrder } = params

  const {
    huobiOrder,
    rawSymbol,
  } = rawOrder

  const {
    settings,
    id: exchangeId,
  } = exchange

  const { symbolMappings } = settings

  let {
    bc: baseSymbolId,
    qc: quoteSymbolId,
  } = rawSymbol

  baseSymbolId = translateSymbolId({
    exchangeSymbolId: baseSymbolId,
    symbolMappings,
  })

  quoteSymbolId = translateSymbolId({
    exchangeSymbolId: quoteSymbolId,
    symbolMappings,
  })

  const isConditionalOrder = !(<IHuobiOrderSchema> huobiOrder).id

  let order: IAlunaOrderSchema

  if (isConditionalOrder) {

    ({ order } = parseHuobiConditionalOrder({
      baseSymbolId,
      quoteSymbolId,
      exchangeId,
      huobiConditionalOrder: huobiOrder as IHuobiConditionalOrderSchema,
    }))

  } else {

    ({ order } = parseHuobiOrder({
      baseSymbolId,
      quoteSymbolId,
      exchangeId,
      huobiOrder: huobiOrder as IHuobiOrderSchema,
    }))

  }

  return { order }

}
