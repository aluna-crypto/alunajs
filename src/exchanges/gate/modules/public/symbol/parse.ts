import { IAlunaExchangePublic } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaSymbolParseParams,
  IAlunaSymbolParseReturns,
} from '../../../../../lib/modules/public/IAlunaSymbolModule'
import { IAlunaSymbolSchema } from '../../../../../lib/schemas/IAlunaSymbolSchema'
import { translateSymbolId } from '../../../../../utils/mappings/translateSymbolId'
import { gateBaseSpecs } from '../../../gateSpecs'
import { IGateSymbolSchema } from '../../../schemas/IGateSymbolSchema'



export const parse = (exchange: IAlunaExchangePublic) => (
  params: IAlunaSymbolParseParams<IGateSymbolSchema>,
): IAlunaSymbolParseReturns => {

  const { rawSymbol } = params

  const {
    name,
    symbol,
  } = rawSymbol

  const { symbolMappings } = exchange.settings

  const id = translateSymbolId({
    exchangeSymbolId: symbol,
    symbolMappings,
  })

  const alias = (id !== symbol ? symbol : undefined)

  // TODO: Review symbol assembling
  const parsedSymbol: IAlunaSymbolSchema = {
    id,
    name,
    alias,
    exchangeId: gateBaseSpecs.id,
    meta: rawSymbol,
  }

  return { symbol: parsedSymbol }

}
