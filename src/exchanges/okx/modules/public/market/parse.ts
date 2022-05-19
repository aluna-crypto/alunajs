import { IAlunaExchangePublic } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaMarketParseParams,
  IAlunaMarketParseReturns,
} from '../../../../../lib/modules/public/IAlunaMarketModule'
import { IAlunaMarketSchema } from '../../../../../lib/schemas/IAlunaMarketSchema'
import { translateSymbolId } from '../../../../../utils/mappings/translateSymbolId'
import { IOkxMarketSchema } from '../../../schemas/IOkxMarketSchema'



export const parse = (exchange: IAlunaExchangePublic) => (
  params: IAlunaMarketParseParams<IOkxMarketSchema>,
): IAlunaMarketParseReturns => {

  const { rawMarket } = params

  const {
    askPx,
    bidPx,
    high24h,
    instId,
    last,
    low24h,
    open24h,
    vol24h,
    volCcy24h,
  } = rawMarket

  const [
    baseCurrency,
    quoteCurrency,
  ] = instId.split('-')

  const { symbolMappings } = exchange.settings

  const baseSymbolId = translateSymbolId({
    exchangeSymbolId: baseCurrency,
    symbolMappings,
  })

  const quoteSymbolId = translateSymbolId({
    exchangeSymbolId: quoteCurrency,
    symbolMappings,
  })

  const change = Number(open24h) - Number(last)

  const ticker = {
    high: Number(high24h),
    low: Number(low24h),
    bid: Number(bidPx),
    ask: Number(askPx),
    last: Number(last),
    date: new Date(),
    change,
    baseVolume: Number(vol24h),
    quoteVolume: Number(volCcy24h),
  }

  const market: IAlunaMarketSchema = {
    symbolPair: instId,
    baseSymbolId,
    quoteSymbolId,
    ticker,
    exchangeId: exchange.specs.id,
    spotEnabled: true,
    derivativesEnabled: false,
    leverageEnabled: false,
    marginEnabled: false,
    meta: rawMarket,
  }

  return { market }

}
