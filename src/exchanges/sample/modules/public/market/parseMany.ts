import debug from 'debug'
import {
  keyBy,
  reduce,
} from 'lodash'

import { IAlunaExchangePublic } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaMarketParseManyParams,
  IAlunaMarketParseManyReturns,
} from '../../../../../lib/modules/public/IAlunaMarketModule'
import { IAlunaMarketSchema } from '../../../../../lib/schemas/IAlunaMarketSchema'
import { SampleMarketStatusEnum } from '../../../enums/SampleMarketStatusEnum'
import {
  ISampleMarketInfoSchema,
  ISampleMarketsSchema,
} from '../../../schemas/ISampleMarketSchema'



const log = debug('@aluna.js:sample/market/parseMany')



export const parseMany = (exchange: IAlunaExchangePublic) => (
  params: IAlunaMarketParseManyParams<ISampleMarketsSchema>,
): IAlunaMarketParseManyReturns => {

  const { rawMarkets } = params

  const {
    marketsInfo,
    summaries,
    tickers,
  } = rawMarkets

  const tickersDict = keyBy(tickers, 'symbol')
  const summariesDict = keyBy(summaries, 'symbol')

  type TSrc = ISampleMarketInfoSchema
  type TAcc = IAlunaMarketSchema[]

  const markets = reduce<TSrc, TAcc>(marketsInfo, (acc, out) => {

    const {
      symbol,
      status,
    } = out

    if (status === SampleMarketStatusEnum.OFFLINE) {

      return acc

    }

    const ticker = tickersDict[symbol]
    const summary = summariesDict[symbol]

    const { market } = exchange.market.parse({
      rawMarket: {
        marketInfo: out,
        summary,
        ticker,
      },
    })

    acc.push(market)

    return acc

  }, [])

  log(`parsed ${markets.length} markets for Sample`)

  return { markets }

}
