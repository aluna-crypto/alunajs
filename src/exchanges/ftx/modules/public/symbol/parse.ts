import { IAlunaExchangePublic } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaSymbolParseParams,
  IAlunaSymbolParseReturns,
} from '../../../../../lib/modules/public/IAlunaSymbolModule'
import { IAlunaSymbolSchema } from '../../../../../lib/schemas/IAlunaSymbolSchema'
import { translateSymbolId } from '../../../../../utils/mappings/translateSymbolId'
import { ftxBaseSpecs } from '../../../ftxSpecs'
import { IFtxMarketSchema } from '../../../schemas/IFtxMarketSchema'



export const parse = (exchange: IAlunaExchangePublic) => (
  params: IAlunaSymbolParseParams<IFtxMarketSchema>,
): IAlunaSymbolParseReturns => {

  const { rawSymbol } = params

  const {
    baseCurrency,
  } = rawSymbol

  const id = translateSymbolId({
    exchangeSymbolId: baseCurrency,
    symbolMappings: exchange.settings.symbolMappings,
  })

  const alias = (id !== baseCurrency ? baseCurrency : undefined)

  const parsedSymbol: IAlunaSymbolSchema = {
    id,
    alias,
    exchangeId: ftxBaseSpecs.id,
    meta: rawSymbol,
  }

  return { symbol: parsedSymbol }

}
