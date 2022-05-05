import debug from 'debug'
import { keyBy, reduce } from 'lodash'

import { IAlunaExchangePublic } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaMarketParseManyParams,
  IAlunaMarketParseManyReturns,
} from '../../../../../lib/modules/public/IAlunaMarketModule'
import { IAlunaMarketSchema } from '../../../../../lib/schemas/IAlunaMarketSchema'
import { IValrMarketsSchema, IValrMarketSummarySchema } from '../../../schemas/IValrMarketSchema'



const log = debug('@alunajs:valr/market/parseMany')



export const parseMany = (exchange: IAlunaExchangePublic) => (
  params: IAlunaMarketParseManyParams<IValrMarketsSchema>,
): IAlunaMarketParseManyReturns => {

  const { rawMarkets } = params

  const {
    pairs,
    summaries,
  } = rawMarkets


  const pairsDict = keyBy(pairs, 'symbol')

  type TSrc = IValrMarketSummarySchema
  type TAcc = IAlunaMarketSchema[]

  const markets = reduce<TSrc, TAcc>(summaries, (acc, curr) => {

    const {
      currencyPair,
    } = curr

    const pair = pairsDict[currencyPair]

    if (!pair.active) {

      return acc

    }

    const { market } = exchange.market.parse({
      rawMarket: {
        summary: curr,
        pair,
      },
    })

    acc.push(market)

    return acc

  }, [])

  log(`parsed ${markets.length} markets for Valr`)

  return { markets }

}
