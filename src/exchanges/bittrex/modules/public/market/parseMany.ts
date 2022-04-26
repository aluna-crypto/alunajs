import debug from 'debug'
import { map } from 'lodash'

import {
  IAlunaMarketParseManyParams,
  IAlunaMarketParseManyReturns,
} from '../../../../../lib/modules/public/IAlunaMarketModule'
import { BittrexHttp } from '../../../BittrexHttp'
import { parse } from './parse'



const log = debug('@aluna.js:bittrex/market/parseMany')



export async function parseMany (
  params: IAlunaMarketParseManyParams,
): Promise<IAlunaMarketParseManyReturns> {

  const {
    http = new BittrexHttp(),
    rawMarkets,
  } = params

  const marketsPromises = map(rawMarkets, async (rawMarket) => {

    const { market } = await parse({
      rawMarket,
    })

    return market

  })

  const markets = await Promise.all(marketsPromises)

  log(`parsed ${markets.length} markets for Bittrex`)

  const { requestCount } = http

  return {
    markets,
    requestCount,
  }

}
