import debug from 'debug'
import {
  forOwn,
  map,
} from 'lodash'

import { IAlunaExchangePublic } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaMarketParseManyParams,
  IAlunaMarketParseManyReturns,
} from '../../../../../lib/modules/public/IAlunaMarketModule'
import {
  IPoloniexMarketResponseSchema,
  IPoloniexMarketSchema,
} from '../../../schemas/IPoloniexMarketSchema'



const log = debug('alunajs:poloniex/market/parseMany')



export const parseMany = (exchange: IAlunaExchangePublic) => (
  params: IAlunaMarketParseManyParams<IPoloniexMarketResponseSchema>,
): IAlunaMarketParseManyReturns => {

  const {
    rawMarkets: rawMarketsResponse,
  } = params

  const rawMarkets: IPoloniexMarketSchema[] = []

  forOwn(rawMarketsResponse, (value, key) => {

    // Poloniex 'base' and 'quote' currency are inverted
    const [quoteCurrency, baseCurrency] = key.split('_')

    rawMarkets.push({
      currencyPair: key,
      quoteCurrency,
      baseCurrency,
      ...value,
    })

  })

  const markets = map(rawMarkets, (rawMarket) => {

    const { market } = exchange.market.parse({
      rawMarket,
    })

    return market

  })

  log(`parsed ${markets.length} markets for Poloniex`)

  return { markets }

}
