import { IAlunaExchangePublic } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaSymbolParseParams,
  IAlunaSymbolParseReturns,
} from '../../../../../lib/modules/public/IAlunaSymbolModule'
import { IAlunaSymbolSchema } from '../../../../../lib/schemas/IAlunaSymbolSchema'
import { translateSymbolId } from '../../../../../utils/mappings/translateSymbolId'
import { poloniexBaseSpecs } from '../../../poloniexSpecs'
import { IPoloniexSymbolSchema } from '../../../schemas/IPoloniexSymbolSchema'



export const parse = (exchange: IAlunaExchangePublic) => (
  params: IAlunaSymbolParseParams<IPoloniexSymbolSchema>,
): IAlunaSymbolParseReturns => {

  const { rawSymbol } = params

  const {
    name,
    symbol,
  } = rawSymbol

  const id = translateSymbolId({
    exchangeSymbolId: symbol,
    symbolMappings: exchange.settings.symbolMappings,
  })

  const alias = (id !== symbol ? symbol : undefined)

  // TODO: Review symbol assembling
  const parsedSymbol: IAlunaSymbolSchema = {
    id,
    name,
    alias,
    exchangeId: poloniexBaseSpecs.id,
    meta: rawSymbol,
  }

  return { symbol: parsedSymbol }

}
