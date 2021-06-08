import { expect } from 'chai'

import { VALR_SEEDS } from '../../test/fixtures'
import { ValrCurrencyPairsParser } from './ValrCurrencyPairsParser'



describe('ValrCurrencyPairsParser', () => {

  const { marketsSeeds } = VALR_SEEDS



  it('should parse Valr currency pairs just fine', () => {

    const {
      rawMarkets, rawCurrencyPairs,
    } = marketsSeeds

    const marketWithCurr = ValrCurrencyPairsParser.parse({
      rawMarkets,
      rawCurrencyPairs,
    })

    /**
    * Currency pairs with no corresponding markets must be ignored by the
    * parser
    */
    expect(rawCurrencyPairs.length).to.be.eq(5)

    expect(marketWithCurr.length).to.be.eq(3)

    marketWithCurr.forEach((item, index) => {

      const {
        askPrice,
        baseCurrency,
        baseVolume,
        bidPrice,
        changeFromPrevious,
        created,
        currencyPair,
        highPrice,
        lastTradedPrice,
        lowPrice,
        previousClosePrice,
        quoteCurrency,
      } = item

      expect(currencyPair).to.be.eq(rawMarkets[index].currencyPair)
      expect(askPrice).to.be.eq(rawMarkets[index].askPrice)
      expect(bidPrice).to.be.eq(rawMarkets[index].bidPrice)
      expect(lastTradedPrice).to.be.eq(rawMarkets[index].lastTradedPrice)
      expect(previousClosePrice).to.be.eq(rawMarkets[index].previousClosePrice)
      expect(baseVolume).to.be.eq(rawMarkets[index].baseVolume)
      expect(highPrice).to.be.eq(rawMarkets[index].highPrice)
      expect(lowPrice).to.be.eq(rawMarkets[index].lowPrice)
      expect(created).to.be.eq(rawMarkets[index].created)
      expect(changeFromPrevious).to.be.eq(rawMarkets[index].changeFromPrevious)

      expect(baseCurrency).to.be.ok
      expect(quoteCurrency).to.be.ok
      expect(`${baseCurrency}${quoteCurrency}`)
        .to.be.eq(rawMarkets[index].currencyPair)

    })

  })

})
