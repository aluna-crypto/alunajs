import debug from 'debug'

import {
  IAlunaMarketParseManyParams,
  IAlunaMarketParseManyReturns,
} from '../../../../../lib/modules/public/IAlunaMarketModule'
import { IBittrexMarketSchema } from '../../../schemas/IBittrexMarketSchema'



const log = debug('@aluna.js:bittrex/market/parseMany')



export function parseMany (
  params: IAlunaMarketParseManyParams<IBittrexMarketSchema>,
): IAlunaMarketParseManyReturns {

  const { rawMarkets } = params

  const markets = rawMarkets as any

  // const markets = map(rawMarkets, (rawMarket) => {

  //   const { market } = parse({
  //     rawMarket,
  //   })

  //   return market

  // })

  log(`parsed ${markets.length} markets for Bittrex`)

  return { markets }

}
