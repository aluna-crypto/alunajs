import { IAlunaExchangePublic } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaMarketParseParams,
  IAlunaMarketParseReturns,
} from '../../../../../lib/modules/public/IAlunaMarketModule'
import { IAlunaMarketSchema } from '../../../../../lib/schemas/IAlunaMarketSchema'
import { IAlunaTickerSchema } from '../../../../../lib/schemas/IAlunaTickerSchema'
import { translateSymbolId } from '../../../../../lib/utils/mappings/translateSymbolId'
import { bittrexBaseSpecs } from '../../../bittrexSpecs'
import { IBittrexMarketSchema } from '../../../schemas/IBittrexMarketSchema'



export const parse = (exchange: IAlunaExchangePublic) => (
  params: IAlunaMarketParseParams<IBittrexMarketSchema>,
): IAlunaMarketParseReturns => {

  const { rawMarket } = params

  const {
    marketInfo,
    summary,
    ticker,
  } = rawMarket

  const {
    volume,
    quoteVolume,
    symbol,
    high,
    low,
    percentChange,
  } = summary

  const {
    lastTradeRate,
    askRate,
    bidRate,
  } = ticker

  const {
    baseCurrencySymbol,
    quoteCurrencySymbol,
  } = marketInfo

  const baseSymbolId = translateSymbolId({
    exchangeSymbolId: baseCurrencySymbol,
    symbolMappings: exchange.settings.mappings,
  })

  const quoteSymbolId = translateSymbolId({
    exchangeSymbolId: quoteCurrencySymbol,
    symbolMappings: exchange.settings.mappings,
  })

  const alunaTicker: IAlunaTickerSchema = {
    high: parseFloat(high),
    low: parseFloat(low),
    bid: parseFloat(bidRate),
    ask: parseFloat(askRate),
    last: parseFloat(lastTradeRate),
    date: new Date(),
    change: parseFloat(percentChange) / 100,
    baseVolume: parseFloat(volume),
    quoteVolume: parseFloat(quoteVolume),
  }

  const market: IAlunaMarketSchema = {
    exchangeId: bittrexBaseSpecs.id,
    symbolPair: symbol,
    baseSymbolId,
    quoteSymbolId,
    ticker: alunaTicker,
    spotEnabled: true,
    marginEnabled: false,
    derivativesEnabled: false,
    leverageEnabled: false,
    meta: rawMarket,
  }

  return { market }

}
