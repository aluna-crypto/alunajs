import debug from 'debug'
import { find, map } from 'lodash'

import { IAlunaExchangePublic } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaMarketParseManyParams,
  IAlunaMarketParseManyReturns,
} from '../../../../../lib/modules/public/IAlunaMarketModule'
import { IOkxMarketResponseSchema, IOkxMarketsResponseSchema } from '../../../schemas/IOkxMarketSchema'



const log = debug('alunajs:okx/market/parseMany')



export const parseMany = (exchange: IAlunaExchangePublic) => (
  params: IAlunaMarketParseManyParams<IOkxMarketsResponseSchema>,
): IAlunaMarketParseManyReturns => {

  const { rawMarkets: rawMarketsResponse } = params

  const {
    rawMarkets,
    rawSymbols,
  } = rawMarketsResponse

  const markets = map(rawMarkets, (rawMarket) => {

    const { instId } = rawMarket

    const rawSpotSymbol = find(rawSymbols, {
      instId,
    })

    const rawMarginSymbol = find(rawSymbols, {
      instId,
    })

    const rawMarketRequest: IOkxMarketResponseSchema = {
      rawMarket,
      rawSpotSymbol,
      rawMarginSymbol,
    }

    const { market } = exchange.market.parse({
      rawMarket: rawMarketRequest,
    })

    return market

  })

  log(`parsed ${markets.length} markets for Okx`)

  return { markets }

}
