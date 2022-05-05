import debug from 'debug'
import { map } from 'lodash'

import { IAlunaExchangePublic } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaMarketParseManyParams,
  IAlunaMarketParseManyReturns,
} from '../../../../../lib/modules/public/IAlunaMarketModule'
import { IValrMarketSchema } from '../../../schemas/IValrMarketSchema'



const log = debug('@alunajs:valr/market/parseMany')



export const parseMany = (exchange: IAlunaExchangePublic) => (
  params: IAlunaMarketParseManyParams<IValrMarketSchema[]>,
): IAlunaMarketParseManyReturns => {

  const { rawMarkets } = params

  // TODO: Review implementation
  const markets = map(rawMarkets, (rawMarket) => {

    const { market } = exchange.market.parse({
      rawMarket,
    })

    return market

  })

  log(`parsed ${markets.length} markets for Valr`)

  return { markets }

}
