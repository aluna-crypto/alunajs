import { IAlunaExchangePublic } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaMarketParseParams,
  IAlunaMarketParseReturns,
} from '../../../../../lib/modules/public/IAlunaMarketModule'
import { IAlunaMarketSchema } from '../../../../../lib/schemas/IAlunaMarketSchema'
import { IAlunaTickerSchema } from '../../../../../lib/schemas/IAlunaTickerSchema'
import { translateSymbolId } from '../../../../../utils/mappings/translateSymbolId'
import { FtxMarketTypeEnum } from '../../../enums/FtxMarketTypeEnum'
import { IFtxMarketSchema } from '../../../schemas/IFtxMarketSchema'
import { splitFtxSymbolPair } from './helpers/splitFtxSymbolPair'



export const parse = (exchange: IAlunaExchangePublic) => (
  params: IAlunaMarketParseParams<IFtxMarketSchema>,
): IAlunaMarketParseReturns => {

  const { rawMarket } = params

  const {
    ask,
    bid,
    change24h,
    last,
    name,
    price,
    quoteVolume24h,
    volumeUsd24h,
    type,
  } = rawMarket

  let {
    baseSymbolId,
    quoteSymbolId,
  } = splitFtxSymbolPair({ market: name })

  const {
    settings: { symbolMappings },
    specs: { id: exchangeId },
  } = exchange

  baseSymbolId = translateSymbolId({
    exchangeSymbolId: baseSymbolId,
    symbolMappings,
  })

  quoteSymbolId = translateSymbolId({
    exchangeSymbolId: quoteSymbolId,
    symbolMappings,
  })

  const isUsdBaseCurrency = baseSymbolId === 'USD'

  const baseVolume = isUsdBaseCurrency
    ? volumeUsd24h
    : 0

  const ticker: IAlunaTickerSchema = {
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

  const isFuture = type === FtxMarketTypeEnum.FUTURE

  const market: IAlunaMarketSchema = {
    exchangeId,
    symbolPair: name,
    baseSymbolId,
    quoteSymbolId,
    ticker,
    spotEnabled: !isFuture,
    marginEnabled: false,
    derivativesEnabled: isFuture,
    leverageEnabled: isFuture,
    meta: rawMarket,
  }

  return { market }

}
