import { IAlunaExchangePublic } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaMarketParseParams,
  IAlunaMarketParseReturns,
} from '../../../../../lib/modules/public/IAlunaMarketModule'
import { IAlunaMarketSchema } from '../../../../../lib/schemas/IAlunaMarketSchema'
import { translateSymbolId } from '../../../../../utils/mappings/translateSymbolId'
import { IFtxMarketSchema } from '../../../schemas/IFtxMarketSchema'



export const parse = (exchange: IAlunaExchangePublic) => (
  params: IAlunaMarketParseParams<IFtxMarketSchema>,
): IAlunaMarketParseReturns => {

  const { rawMarket } = params

  const {
    ask,
    baseCurrency,
    bid,
    change24h,
    last,
    name,
    price,
    quoteCurrency,
    quoteVolume24h,
    volumeUsd24h,
  } = rawMarket

  const isUsdBaseCurrency = baseCurrency === 'USD'

  const baseVolume = isUsdBaseCurrency ? volumeUsd24h : 0

  const { settings, specs } = exchange

  const { id: exchangeId } = specs

  const { symbolMappings } = settings

  const baseSymbolId = translateSymbolId({
    exchangeSymbolId: baseCurrency,
    symbolMappings,
  })

  const quoteSymbolId = translateSymbolId({
    exchangeSymbolId: quoteCurrency,
    symbolMappings,
  })

  const ticker = {
    high: price,
    low: price,
    bid,
    ask,
    last,
    date: new Date(),
    change: change24h,
    baseVolume,
    quoteVolume: quoteVolume24h,
  }

  const market: IAlunaMarketSchema = {
    exchangeId,
    symbolPair: name,
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
