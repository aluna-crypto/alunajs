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



export const parse = (exchange: IAlunaExchangePublic) => (
  params: IAlunaMarketParseParams<IBitfinexMarketSchema>,
): IAlunaMarketParseReturns => {


  const { rawMarket } = params

  const {
    ticker: rawTicker,
    enabledMarginCurrency,
  } = rawMarket

  const [
    symbol,
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


  let baseSymbolId: string
  let quoteSymbolId: string

  const spliter = symbol.indexOf(':')

  if (spliter >= 0) {

    baseSymbolId = symbol.slice(1, spliter)
    quoteSymbolId = symbol.slice(spliter + 1)

  } else {

    baseSymbolId = symbol.slice(1, 4)
    quoteSymbolId = symbol.slice(4)

  }

  const { symbolMappings } = bitfinexBaseSpecs.settings

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
    symbolPair: symbol,
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
