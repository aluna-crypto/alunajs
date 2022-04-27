import debug from 'debug'
import {
  keyBy,
  reduce,
} from 'lodash'

import {
  IAlunaMarketParseManyParams,
  IAlunaMarketParseManyReturns,
} from '../../../../../lib/modules/public/IAlunaMarketModule'
import { IAlunaMarketSchema } from '../../../../../lib/schemas/IAlunaMarketSchema'
import { BittrexMarketStatusEnum } from '../../../enums/BittrexMarketStatusEnum'
import { IBittrexMarketsSchema } from '../../../schemas/IBittrexMarketSchema'
import { parse } from './parse'



const log = debug('@aluna.js:bittrex/market/parseMany')



export function parseMany (
  params: IAlunaMarketParseManyParams<IBittrexMarketsSchema>,
): IAlunaMarketParseManyReturns {

  const { rawMarkets } = params

  const {
    marketsInfo,
    summaries,
    tickers,
  } = rawMarkets

  const tickersDict = keyBy(tickers, 'symbol')
  const summariesDict = keyBy(summaries, 'symbol')

  const markets = reduce(marketsInfo, (accumulator, current) => {

    const {
      symbol,
      status,
    } = current

    if (status === BittrexMarketStatusEnum.OFFLINE) {

      return accumulator

    }

    const ticker = tickersDict[symbol]
    const summary = summariesDict[symbol]

    const { market } = parse({
      rawMarket: {
        marketInfo: current,
        summary,
        ticker,
      },
    })

    accumulator.push(market)

    return accumulator

  }, [] as IAlunaMarketSchema[])

  log(`parsed ${markets.length} markets for Bittrex`)

  return { markets }

}
