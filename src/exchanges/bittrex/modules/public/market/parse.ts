// import debug from 'debug'
import {
  IAlunaMarketParseParams,
  IAlunaMarketParseReturns,
} from '../../../../../lib/modules/public/IAlunaMarketModule'
import { IBittrexMarketSchema } from '../../../schemas/IBittrexMarketSchema'



// const log = debug('@aluna.js:bittrex/market/parse')



export function parse (
  params: IAlunaMarketParseParams<IBittrexMarketSchema>,
): IAlunaMarketParseReturns {

  const { rawMarket } = params

  const market = rawMarket as any

  // const {
  //   volume,
  //   quoteVolume,
  //   symbol,
  //   baseCurrencySymbol,
  //   quoteCurrencySymbol,
  //   askRate,
  //   bidRate,
  //   high,
  //   lastTradeRate,
  //   low,
  //   percentChange,
  // } = rawMarket

  // const ticker: IAlunaTickerSchema = {
  //   high: parseFloat(high),
  //   low: parseFloat(low),
  //   bid: parseFloat(bidRate),
  //   ask: parseFloat(askRate),
  //   last: parseFloat(lastTradeRate),
  //   date: new Date(),
  //   change: parseFloat(percentChange) / 100,
  //   baseVolume: parseFloat(volume),
  //   quoteVolume: parseFloat(quoteVolume),
  // }

  // const market: IAlunaMarketSchema = {
  //   exchangeId: bittrexBaseSpecs.id,
  //   symbolPair: symbol,

  //   // Use Symbol Mappings
  //   baseSymbolId: baseCurrencySymbol,
  //   quoteSymbolId: quoteCurrencySymbol,
  //   ticker,
  //   spotEnabled: true,
  //   marginEnabled: false,
  //   derivativesEnabled: false,
  //   leverageEnabled: false,
  //   meta: rawMarket,
  // }

  return { market }

}
