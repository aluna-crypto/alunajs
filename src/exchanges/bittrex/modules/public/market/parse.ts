import {
  IAlunaMarketParseParams,
  IAlunaMarketParseReturns,
} from '../../../../../lib/modules/public/IAlunaMarketModule'
import { BittrexHttp } from '../../../BittrexHttp'
import { bittrexBaseSpecs } from '../../../bittrexSpecs'



export async function parse (
  params: IAlunaMarketParseParams,
): Promise<IAlunaMarketParseReturns> {

  const {
    http = new BittrexHttp(),
    rawMarket,
  } = params

  const {
    volume,
    quoteVolume,
    symbol,
    baseCurrencySymbol,
    quoteCurrencySymbol,
    askRate,
    bidRate,
    high,
    lastTradeRate,
    low,
    percentChange,
  } = rawMarket


  const ticker = {
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

  const market = {
    exchangeId: bittrexBaseSpecs.id,
    symbolPair: symbol,

    // Use Symbol Mappings
    baseSymbolId: baseCurrencySymbol,
    quoteSymbolId: quoteCurrencySymbol,
    ticker,
    spotEnabled: true,
    marginEnabled: false,
    derivativesEnabled: false,
    leverageEnabled: false,
    meta: rawMarket,
  }

  const { requestCount } = http

  return {
    market,
    requestCount,
  }

}
