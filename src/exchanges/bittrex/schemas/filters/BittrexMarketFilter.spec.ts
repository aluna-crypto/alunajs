import { expect } from 'chai'

import { BittrexMarketStatusEnum } from '../../enums/BittrexMarketStatusEnum'
import {
  BITTREX_RAW_MARKETS,
  BITTREX_RAW_MARKET_SUMMARIES,
} from '../../test/fixtures/bittrexMarket'
import { IBittrexMarketSchema } from '../IBittrexMarketSchema'
import { BittrexMarketFilter } from './BittrexMarketFilter'



describe('BittrexMarketFilter', () => {

  it('should filter Bittrex active markets just fine', () => {

    const rawMarketSummaries = BITTREX_RAW_MARKET_SUMMARIES
    const rawMarkets = BITTREX_RAW_MARKETS

    const filteredMarkets = BittrexMarketFilter.filter({
      rawMarketSummaries,
      rawMarkets,
    })

    expect(rawMarketSummaries.length).to.be.eq(4)
    expect(rawMarkets.length).to.be.eq(4)
    expect(filteredMarkets.length).to.be.eq(3)

    const marketDictionary:
    { [key:string]: IBittrexMarketSchema } = {}

    rawMarkets.forEach((pair) => {

      const { symbol } = pair

      marketDictionary[symbol] = pair

    })

    filteredMarkets.forEach((item) => {

      const {
        symbol,
      } = item

      const rawMarket = marketDictionary[symbol]

      expect(rawMarket).to.be.ok
      expect(rawMarket.status).to.be.eq(BittrexMarketStatusEnum.ONLINE)

    })

  })

})
