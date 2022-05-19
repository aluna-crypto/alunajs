import { IAlunaExchangePublic } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaSymbolParseParams,
  IAlunaSymbolParseReturns,
} from '../../../../../lib/modules/public/IAlunaSymbolModule'
import { IAlunaSymbolSchema } from '../../../../../lib/schemas/IAlunaSymbolSchema'
import { translateSymbolId } from '../../../../../utils/mappings/translateSymbolId'
import { okxBaseSpecs } from '../../../okxSpecs'
import { IOkxSymbolSchema } from '../../../schemas/IOkxSymbolSchema'



export const parse = (exchange: IAlunaExchangePublic) => (
  params: IAlunaSymbolParseParams<IOkxSymbolSchema>,
): IAlunaSymbolParseReturns => {

  const { rawSymbol } = params

  const {
    baseCcy,
  } = rawSymbol

  const id = translateSymbolId({
    exchangeSymbolId: baseCcy,
    symbolMappings: exchange.settings.symbolMappings,
  })

  const alias = (id !== baseCcy ? baseCcy : undefined)

  const parsedSymbol: IAlunaSymbolSchema = {
    id,
    alias,
    exchangeId: okxBaseSpecs.id,
    meta: rawSymbol,
  }

  return { symbol: parsedSymbol }

}
