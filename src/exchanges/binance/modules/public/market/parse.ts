import { IAlunaExchangePublic } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaMarketParseParams,
  IAlunaMarketParseReturns,
} from '../../../../../lib/modules/public/IAlunaMarketModule'
import { IAlunaMarketSchema } from '../../../../../lib/schemas/IAlunaMarketSchema'
import { translateSymbolId } from '../../../../../utils/mappings/translateSymbolId'
import { binanceBaseSpecs } from '../../../binanceSpecs'
import { IBinanceMarketResponseSchema } from '../../../schemas/IBinanceMarketSchema'



export const parse = (exchange: IAlunaExchangePublic) => (
  params: IAlunaMarketParseParams<IBinanceMarketResponseSchema>,
): IAlunaMarketParseReturns => {

  const { rawMarket } = params

  const {
    rawSymbol,
    rawTicker,
  } = rawMarket

  const {
    baseAsset,
    quoteAsset,
    isSpotTradingAllowed,
    isMarginTradingAllowed,
  } = rawSymbol

  const {
    askPrice,
    volume,
    bidPrice,
    highPrice,
    lastPrice,
    lowPrice,
    priceChange,
    quoteVolume,
    symbol,
  } = rawTicker

  const { symbolMappings } = exchange.settings

  const baseSymbolId = translateSymbolId({
    exchangeSymbolId: baseAsset,
    symbolMappings,
  })

  const quoteSymbolId = translateSymbolId({
    exchangeSymbolId: quoteAsset,
    symbolMappings,
  })

  const ticker = {
    high: parseFloat(highPrice),
    low: parseFloat(lowPrice),
    bid: parseFloat(bidPrice),
    ask: parseFloat(askPrice),
    last: parseFloat(lastPrice),
    date: new Date(),
    change: parseFloat(priceChange) / 100,
    baseVolume: parseFloat(volume),
    quoteVolume: parseFloat(quoteVolume),
  }

  const market: IAlunaMarketSchema = {
    baseSymbolId,
    quoteSymbolId,
    exchangeId: binanceBaseSpecs.id,
    marginEnabled: isMarginTradingAllowed,
    spotEnabled: isSpotTradingAllowed,
    derivativesEnabled: false,
    leverageEnabled: false,
    ticker,
    symbolPair: symbol,
    meta: rawMarket,
  }

  return { market }

}
