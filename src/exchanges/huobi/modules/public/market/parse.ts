import { IAlunaExchangePublic } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaMarketParseParams,
  IAlunaMarketParseReturns,
} from '../../../../../lib/modules/public/IAlunaMarketModule'
import { IAlunaMarketSchema } from '../../../../../lib/schemas/IAlunaMarketSchema'
import { translateSymbolId } from '../../../../../utils/mappings/translateSymbolId'
import { IHuobiMarketSchema } from '../../../schemas/IHuobiMarketSchema'



export const parse = (exchange: IAlunaExchangePublic) => (
  params: IAlunaMarketParseParams<IHuobiMarketSchema>,
): IAlunaMarketParseReturns => {

  const { rawMarket } = params

  const {
    huobiMarket,
    rawSymbol,
  } = rawMarket

  const {
    symbol,
    high,
    low,
    ask,
    bid,
    close,
    open,
    amount: baseVolume,
    vol: quoteVolume,
  } = huobiMarket

  const {
    bc: baseCurrency,
    qc: quoteCurrency,
  } = rawSymbol

  const { settings, id: exchangeId } = exchange

  const { symbolMappings } = settings

  const baseSymbolId = translateSymbolId({
    exchangeSymbolId: baseCurrency,
    symbolMappings,
  })

  const quoteSymbolId = translateSymbolId({
    exchangeSymbolId: quoteCurrency,
    symbolMappings,
  })

  const change = open - close

  const ticker = {
    high,
    low,
    bid,
    ask,
    last: close,
    date: new Date(),
    change,
    baseVolume,
    quoteVolume,
  }

  const market: IAlunaMarketSchema = {
    exchangeId,
    symbolPair: symbol,
    baseSymbolId,
    quoteSymbolId,
    ticker,
    spotEnabled: true,
    marginEnabled: false,
    derivativesEnabled: false,
    leverageEnabled: false,
    meta: huobiMarket,
  }

  return { market }

}
