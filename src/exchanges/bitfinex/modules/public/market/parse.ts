import { IAlunaExchangePublic } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaMarketParseParams,
  IAlunaMarketParseReturns,
} from '../../../../../lib/modules/public/IAlunaMarketModule'
import { IAlunaMarketSchema } from '../../../../../lib/schemas/IAlunaMarketSchema'
import { IAlunaTickerSchema } from '../../../../../lib/schemas/IAlunaTickerSchema'
import { translateSymbolId } from '../../../../../utils/mappings/translateSymbolId'
import { bitfinexBaseSpecs } from '../../../bitfinexSpecs'
import { IBitfinexMarketSchema } from '../../../schemas/IBitfinexMarketSchema'
import { splitSymbolPair } from './helpers/splitSymbolPair'



export const parse = (exchange: IAlunaExchangePublic) => (
  params: IAlunaMarketParseParams<IBitfinexMarketSchema>,
): IAlunaMarketParseReturns => {


  const { rawMarket } = params

  const {
    ticker: rawTicker,
    enabledMarginCurrency,
  } = rawMarket

  const [
    symbolPair,
    bid,
    _bidSize,
    ask,
    _askSize,
    _dailyChange,
    dailyChangeRelative,
    lastPrice,
    volume,
    high,
    low,
  ] = rawTicker


  let {
    baseSymbolId,
    quoteSymbolId,
  } = splitSymbolPair({ symbolPair })

  const { symbolMappings } = exchange.settings

  baseSymbolId = translateSymbolId({
    exchangeSymbolId: baseSymbolId,
    symbolMappings,
  })

  quoteSymbolId = translateSymbolId({
    exchangeSymbolId: quoteSymbolId,
    symbolMappings,
  })

  const ticker: IAlunaTickerSchema = {
    bid,
    ask,
    high,
    low,
    last: lastPrice,
    date: new Date(),
    baseVolume: volume,
    quoteVolume: volume * bid, // estimate
    change: dailyChangeRelative,
  }

  const marginEnabled = !!enabledMarginCurrency

  const market: IAlunaMarketSchema = {
    exchangeId: bitfinexBaseSpecs.id,
    symbolPair,
    baseSymbolId,
    quoteSymbolId,
    ticker,
    spotEnabled: true,
    marginEnabled,
    derivativesEnabled: false,
    leverageEnabled: false,
    meta: rawTicker,
  }

  return { market }

}
