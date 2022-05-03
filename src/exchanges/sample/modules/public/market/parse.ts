import { IAlunaExchangePublic } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaMarketParseParams,
  IAlunaMarketParseReturns,
} from '../../../../../lib/modules/public/IAlunaMarketModule'
import { IAlunaMarketSchema } from '../../../../../lib/schemas/IAlunaMarketSchema'
import { IAlunaTickerSchema } from '../../../../../lib/schemas/IAlunaTickerSchema'
import { translateSymbolId } from '../../../../../lib/utils/mappings/translateSymbolId'
import { sampleBaseSpecs } from '../../../sampleSpecs'
import { ISampleMarketSchema } from '../../../schemas/ISampleMarketSchema'



export const parse = (exchange: IAlunaExchangePublic) => (
  params: IAlunaMarketParseParams<ISampleMarketSchema>,
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
    exchangeId: sampleBaseSpecs.id,
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
