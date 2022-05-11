import { IAlunaExchangePublic } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaMarketParseParams,
  IAlunaMarketParseReturns,
} from '../../../../../lib/modules/public/IAlunaMarketModule'
import { IAlunaMarketSchema } from '../../../../../lib/schemas/IAlunaMarketSchema'
import { translateSymbolId } from '../../../../../utils/mappings/translateSymbolId'
import { gateBaseSpecs } from '../../../gateSpecs'
import { IGateMarketSchema } from '../../../schemas/IGateMarketSchema'



export const parse = (exchange: IAlunaExchangePublic) => (
  params: IAlunaMarketParseParams<IGateMarketSchema>,
): IAlunaMarketParseReturns => {

  const { rawMarket } = params

  const {
    base_volume: baseVolume,
    change_percentage: changePercentage,
    currency_pair: currencyPair,
    high_24h: high24h,
    highest_bid: highestBid,
    last,
    low_24h: low24h,
    lowest_ask: lowestAsk,
    quote_volume: quoteVolume,
  } = rawMarket

  const [baseCurrency, quoteCurrency] = currencyPair.split('_')

  const baseSymbolId = translateSymbolId({
    exchangeSymbolId: baseCurrency,
    symbolMappings: exchange.settings.symbolMappings,
  })

  const quoteSymbolId = translateSymbolId({
    exchangeSymbolId: quoteCurrency,
    symbolMappings: exchange.settings.symbolMappings,
  })

  const ticker = {
    high: Number(high24h),
    low: Number(low24h),
    bid: Number(highestBid),
    ask: Number(lowestAsk),
    last: Number(last),
    date: new Date(),
    change: Number(changePercentage),
    baseVolume: Number(baseVolume),
    quoteVolume: Number(quoteVolume),
  }

  const market: IAlunaMarketSchema = {
    exchangeId: gateBaseSpecs.id,
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
