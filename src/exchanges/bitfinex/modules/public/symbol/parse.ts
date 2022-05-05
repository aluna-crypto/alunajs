import { IAlunaExchangePublic } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaSymbolParseParams,
  IAlunaSymbolParseReturns,
} from '../../../../../lib/modules/public/IAlunaSymbolModule'
import { IAlunaSymbolSchema } from '../../../../../lib/schemas/IAlunaSymbolSchema'
import { translateSymbolId } from '../../../../../utils/mappings/translateSymbolId'
import { bitfinexBaseSpecs } from '../../../bitfinexSpecs'
import { IBitfinexSymbolSchema } from '../../../schemas/IBitfinexSymbolSchema'



export const parse = (exchange: IAlunaExchangePublic) => (
  params: IAlunaSymbolParseParams<IBitfinexSymbolSchema>,
): IAlunaSymbolParseReturns => {

  const { rawSymbol } = params

  const {
    name,
    symbol,
  } = rawSymbol

  const id = translateSymbolId({
    exchangeSymbolId: symbol,
    symbolMappings: exchange.settings.mappings,
  })

  const alias = (id !== symbol ? symbol : undefined)

  // TODO: Review symbol assembling
  const parsedSymbol: IAlunaSymbolSchema = {
    id,
    name,
    alias,
    exchangeId: bitfinexBaseSpecs.id,
    meta: rawSymbol,
  }

  return { symbol: parsedSymbol }

}
