import { map } from 'lodash'

import { BittrexMarketStatusEnum } from '../../enums/BittrexMarketStatusEnum'
import {
  IBittrexMarketSchema,
  IBittrexMarketSummarySchema,
} from '../IBittrexMarketSchema'



export class BittrexMarketFilter {

  static filter (params: {
      rawMarketSummaries: IBittrexMarketSummarySchema[],
      rawMarkets: IBittrexMarketSchema[],
    }): IBittrexMarketSummarySchema[] {

    const {
      rawMarketSummaries,
      rawMarkets,
    } = params

    const marketDictionary:
        { [key:string]: IBittrexMarketSchema } = {}

    rawMarkets.forEach((pair) => {

      const { symbol } = pair

      marketDictionary[symbol] = pair

    })

    const filteredRawMarkets: IBittrexMarketSummarySchema[] = []

    map(rawMarketSummaries, (rawMarketSummary) => {

      const { symbol } = rawMarketSummary

      const rawMarket = marketDictionary[symbol]

      const isOnline = rawMarket
        && rawMarket.status === BittrexMarketStatusEnum.ONLINE

      if (isOnline) {

        return filteredRawMarkets.push(rawMarketSummary)

      }

    })

    return filteredRawMarkets

  }

}
