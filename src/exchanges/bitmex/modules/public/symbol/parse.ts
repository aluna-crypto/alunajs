import { IAlunaExchangePublic } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaSymbolParseParams,
  IAlunaSymbolParseReturns,
} from '../../../../../lib/modules/public/IAlunaSymbolModule'
import { IAlunaSymbolSchema } from '../../../../../lib/schemas/IAlunaSymbolSchema'
import { translateSymbolId } from '../../../../../utils/mappings/translateSymbolId'
import { bitmexBaseSpecs } from '../../../bitmexSpecs'
import { IBitmexSymbolSchema } from '../../../schemas/IBitmexSymbolSchema'



export const parse = (exchange: IAlunaExchangePublic) => (
  params: IAlunaSymbolParseParams<IBitmexSymbolSchema>,
): IAlunaSymbolParseReturns => {

  const { rawSymbol } = params

  const { rootSymbol } = rawSymbol

  const id = translateSymbolId({
    exchangeSymbolId: rootSymbol,
    symbolMappings: exchange.settings.symbolMappings,
  })

  const alias = id !== rootSymbol
    ? rootSymbol
    : undefined


  const symbol: IAlunaSymbolSchema = {
    id,
    alias,
    exchangeId: bitmexBaseSpecs.id,
    meta: rawSymbol,
  }

  return { symbol }

}
