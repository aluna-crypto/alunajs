import { IAlunaExchangePublic } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaMarketParseParams,
  IAlunaMarketParseReturns,
} from '../../../../../lib/modules/public/IAlunaMarketModule'
import { IAlunaMarketSchema } from '../../../../../lib/schemas/IAlunaMarketSchema'
import { IAlunaTickerSchema } from '../../../../../lib/schemas/IAlunaTickerSchema'
import { IValrMarketSchema } from '../../../schemas/IValrMarketSchema'
import { valrBaseSpecs } from '../../../valrSpecs'



export const parse = (exchange: IAlunaExchangePublic) => (
  params: IAlunaMarketParseParams<IValrMarketSchema>,
): IAlunaMarketParseReturns => {

  const { rawMarket } = params

  const {
    pair,
    summary,
  } = rawMarket

  const {
    currencyPair,
    askPrice,
    baseVolume,
    bidPrice,
    changeFromPrevious,
    highPrice,
    lastTradedPrice,
    lowPrice,
  } = summary

  const { baseCurrency, quoteCurrency } = pair

  const ticker: IAlunaTickerSchema = {
    ask: Number(askPrice),
    baseVolume: Number(baseVolume),
    bid: Number(bidPrice),
    change: Number(changeFromPrevious),
    date: new Date(),
    high: Number(highPrice),
    last: Number(lastTradedPrice),
    low: Number(lowPrice),
    quoteVolume: 0,
  }

  const market: IAlunaMarketSchema = {
    baseSymbolId: baseCurrency,
    quoteSymbolId: quoteCurrency,
    exchangeId: valrBaseSpecs.id,
    derivativesEnabled: false,
    leverageEnabled: false,
    marginEnabled: false,
    spotEnabled: true,
    ticker,
    symbolPair: currencyPair,
    meta: rawMarket,
  }

  return { market }

}
