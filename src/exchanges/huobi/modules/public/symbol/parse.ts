import { IAlunaExchangePublic } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaSymbolParseParams,
  IAlunaSymbolParseReturns,
} from '../../../../../lib/modules/public/IAlunaSymbolModule'
import { IAlunaSymbolSchema } from '../../../../../lib/schemas/IAlunaSymbolSchema'
import { translateSymbolId } from '../../../../../utils/mappings/translateSymbolId'
import { huobiBaseSpecs } from '../../../huobiSpecs'
import { IHuobiSymbolSchema } from '../../../schemas/IHuobiSymbolSchema'



export const parse = (exchange: IAlunaExchangePublic) => (
  params: IAlunaSymbolParseParams<IHuobiSymbolSchema>,
): IAlunaSymbolParseReturns => {

  const { rawSymbol } = params

  const {
    bc: symbol,
  } = rawSymbol

  const id = translateSymbolId({
    exchangeSymbolId: symbol,
    symbolMappings: exchange.settings.symbolMappings,
  })

  const alias = (id !== symbol ? symbol : undefined)

  const parsedSymbol: IAlunaSymbolSchema = {
    id,
    alias,
    exchangeId: huobiBaseSpecs.id,
    meta: rawSymbol,
  }

  return { symbol: parsedSymbol }

}
