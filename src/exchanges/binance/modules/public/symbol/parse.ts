import { IAlunaExchangePublic } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaSymbolParseParams,
  IAlunaSymbolParseReturns,
} from '../../../../../lib/modules/public/IAlunaSymbolModule'
import { IAlunaSymbolSchema } from '../../../../../lib/schemas/IAlunaSymbolSchema'
import { translateSymbolId } from '../../../../../utils/mappings/translateSymbolId'
import { binanceBaseSpecs } from '../../../binanceSpecs'
import { IBinanceSymbolSchema } from '../../../schemas/IBinanceSymbolSchema'



export const parse = (exchange: IAlunaExchangePublic) => (
  params: IAlunaSymbolParseParams<IBinanceSymbolSchema>,
): IAlunaSymbolParseReturns => {

  const { rawSymbol } = params

  const {
    baseAsset,
  } = rawSymbol

  const id = translateSymbolId({
    exchangeSymbolId: baseAsset,
    symbolMappings: exchange.settings.symbolMappings,
  })

  const alias = (id !== baseAsset ? baseAsset : undefined)

  const parsedSymbol: IAlunaSymbolSchema = {
    id,
    alias,
    exchangeId: binanceBaseSpecs.id,
    meta: rawSymbol,
  }

  return { symbol: parsedSymbol }

}
