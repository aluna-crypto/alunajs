import { IAlunaExchangePublic } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaMarketParseParams,
  IAlunaMarketParseReturns,
} from '../../../../../lib/modules/public/IAlunaMarketModule'
import { IAlunaMarketSchema } from '../../../../../lib/schemas/IAlunaMarketSchema'
import { translateSymbolId } from '../../../../../utils/mappings/translateSymbolId'
import { IPoloniexMarketSchema } from '../../../schemas/IPoloniexMarketSchema'



export const parse = (exchange: IAlunaExchangePublic) => (
  params: IAlunaMarketParseParams<IPoloniexMarketSchema>,
): IAlunaMarketParseReturns => {

  const { rawMarket } = params

  const {
    baseCurrency,
    quoteCurrency,
    quoteVolume,
    baseVolume,
    currencyPair,
    high24hr,
    highestBid,
    last,
    low24hr,
    lowestAsk,
    percentChange,
  } = rawMarket

  const { symbolMappings } = exchange.settings

  const baseSymbolId = translateSymbolId({
    exchangeSymbolId: baseCurrency,
    symbolMappings,
  })

  const quoteSymbolId = translateSymbolId({
    exchangeSymbolId: quoteCurrency,
    symbolMappings,
  })

  const ticker = {
    high: Number(high24hr),
    low: Number(low24hr),
    bid: Number(highestBid),
    ask: Number(lowestAsk),
    last: Number(last),
    date: new Date(),
    change: Number(percentChange),
    // Poloniex 'base' and 'quote' currency are inverted
    baseVolume: Number(quoteVolume),
    quoteVolume: Number(baseVolume),
  }

  const market: IAlunaMarketSchema = {
    exchangeId: exchange.id,
    symbolPair: currencyPair,
    baseSymbolId,
    quoteSymbolId,
    ticker,
    spotEnabled: true,
    marginEnabled: false,
    derivativesEnabled: false,
    leverageEnabled: false,
    meta: rawMarket,
  }

  return { market }

}
