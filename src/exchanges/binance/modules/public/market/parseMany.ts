import debug from 'debug'
import {
  forEach,
  map,
} from 'lodash'

import { IAlunaExchangePublic } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaMarketParseManyParams,
  IAlunaMarketParseManyReturns,
} from '../../../../../lib/modules/public/IAlunaMarketModule'
import {
  IBinanceMarketResponseSchema,
  IBinanceMarketsResponseSchema,
} from '../../../schemas/IBinanceMarketSchema'
import { IBinanceSymbolSchema } from '../../../schemas/IBinanceSymbolSchema'



const log = debug('alunajs:binance/market/parseMany')



export const parseMany = (exchange: IAlunaExchangePublic) => (
  params: IAlunaMarketParseManyParams<IBinanceMarketsResponseSchema>,
): IAlunaMarketParseManyReturns => {

  const { rawMarkets } = params

  const {
    rawSymbols,
    rawTickers,
  } = rawMarkets

  const pairSymbolsDictionary: { [key:string]: IBinanceSymbolSchema } = {}

  forEach(rawSymbols, (pair) => {

    const { symbol } = pair

    pairSymbolsDictionary[symbol] = pair

  })

  const markets = map(rawTickers, (rawTicker) => {

    const { symbol } = rawTicker

    const rawSymbol = pairSymbolsDictionary[symbol]

    const rawMarket: IBinanceMarketResponseSchema = {
      rawTicker,
      rawSymbol,
    }

    const { market } = exchange.market.parse({
      rawMarket,
    })

    return market

  })

  log(`parsed ${markets.length} markets for Binance`)

  return { markets }

}
