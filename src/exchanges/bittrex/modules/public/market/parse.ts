import { IAlunaExchangePublic } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaMarketParseParams,
  IAlunaMarketParseReturns,
} from '../../../../../lib/modules/public/IAlunaMarketModule'
import { IAlunaMarketSchema } from '../../../../../lib/schemas/IAlunaMarketSchema'
import { IAlunaTickerSchema } from '../../../../../lib/schemas/IAlunaTickerSchema'
import { translateSymbolId } from '../../../../../utils/mappings/translateSymbolId'
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
    symbolMappings: exchange.settings.symbolMappings,
  })

  const quoteSymbolId = translateSymbolId({
    exchangeSymbolId: quoteCurrencySymbol,
    symbolMappings: exchange.settings.symbolMappings,
  })

  const alunaTicker: IAlunaTickerSchema = {
    high: Number(high),
    low: Number(low),
    bid: Number(bidRate),
    ask: Number(askRate),
    last: Number(lastTradeRate),
    date: new Date(),
    change: Number(percentChange) / 100,
    baseVolume: Number(volume),
    quoteVolume: Number(quoteVolume),
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
