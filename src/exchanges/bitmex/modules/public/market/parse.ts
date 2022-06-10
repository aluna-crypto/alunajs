import BigNumber from 'bignumber.js'

import { IAlunaExchangePublic } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaMarketParseParams,
  IAlunaMarketParseReturns,
} from '../../../../../lib/modules/public/IAlunaMarketModule'
import { IAlunaMarketSchema } from '../../../../../lib/schemas/IAlunaMarketSchema'
import { IAlunaTickerSchema } from '../../../../../lib/schemas/IAlunaTickerSchema'
import { translateSymbolId } from '../../../../../utils/mappings/translateSymbolId'
import { IBitmexMarketSchema } from '../../../schemas/IBitmexMarketSchema'
import { computeMinMaxTradeAmount } from './helpers/computeMinMaxTradeAmount'
import { parseBitmexInstrument } from './helpers/parseBitmexInstrument'



export const parse = (exchange: IAlunaExchangePublic) => (
  params: IAlunaMarketParseParams<IBitmexMarketSchema>,
): IAlunaMarketParseReturns => {

  const { rawMarket } = params

  const {
    symbol,
    rootSymbol,
    quoteCurrency,
    highPrice,
    lowPrice,
    bidPrice,
    lastPrice,
    prevClosePrice,
    volume24h,
    askPrice,
    initMargin,
  } = rawMarket

  const { symbolMappings } = exchange.settings

  const baseSymbolId = translateSymbolId({
    exchangeSymbolId: rootSymbol,
    symbolMappings,
  })

  const quoteSymbolId = translateSymbolId({
    exchangeSymbolId: quoteCurrency,
    symbolMappings,
  })

  const { instrument } = parseBitmexInstrument({
    rawMarket,
  })

  const {
    minTradeAmount,
    maxTradeAmount,
  } = computeMinMaxTradeAmount({ rawMarket })

  const change = (1 - (lastPrice / prevClosePrice))
  const quoteVolume = volume24h
  const baseVolume = new BigNumber(volume24h)
    .div(bidPrice)
    .toNumber()

  const ticker: IAlunaTickerSchema = {
    high: highPrice,
    low: lowPrice,
    bid: bidPrice,
    ask: askPrice,
    last: lastPrice,
    change,
    date: new Date(),
    baseVolume,
    quoteVolume,
  }

  const maxLeverage = (1 / initMargin)

  const market: IAlunaMarketSchema = {
    symbolPair: symbol,
    exchangeId: exchange.id,
    baseSymbolId,
    quoteSymbolId,
    ticker,
    minTradeAmount,
    maxTradeAmount,
    spotEnabled: false,
    marginEnabled: false,
    derivativesEnabled: true,
    instrument,
    maxLeverage,
    leverageEnabled: true,
    meta: rawMarket,
  }

  return { market }

}
