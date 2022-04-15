import { expect } from 'chai'

import {
  HUOBI_RAW_MARKET,
  HUOBI_RAW_MARKETS,
} from '../../test/fixtures/huobiMarket'
import { HUOBI_RAW_SYMBOLS } from '../../test/fixtures/huobiSymbols'
import { HuobiCurrencyMarketParser } from './HuobiCurrencyMarketParser'



describe('HuobiCurrencyMarketParser', () => {

  it('should parse Huobi currency pairs just fine', () => {

    const rawMarkets = [...HUOBI_RAW_MARKETS, HUOBI_RAW_MARKET]
    const rawSymbols = HUOBI_RAW_SYMBOLS

    const marketWithCurr = HuobiCurrencyMarketParser.parse({
      rawMarkets,
      rawSymbols,
    })

    expect(rawMarkets.length).to.be.eq(4)
    expect(rawSymbols.length).to.be.eq(3)
    expect(marketWithCurr.length).to.be.eq(3)

    marketWithCurr.forEach((item, index) => {

      const {
        amount,
        ask,
        askSize,
        baseCurrency,
        bid,
        bidSize,
        close,
        count,
        high,
        low,
        open,
        symbol,
        vol,
        quoteCurrency,
      } = item

      expect(amount).to.be.eq(rawMarkets[index].amount)
      expect(bid).to.be.eq(rawMarkets[index].bid)
      expect(ask).to.be.eq(rawMarkets[index].ask)
      expect(vol).to.be.eq(rawMarkets[index].vol)
      expect(close).to.be.eq(rawMarkets[index].close)
      expect(high).to.be.eq(rawMarkets[index].high)
      expect(symbol).to.be.eq(rawMarkets[index].symbol)
      expect(open).to.be.eq(rawMarkets[index].open)
      expect(low).to.be.eq(rawMarkets[index].low)
      expect(bidSize).to.be.eq(rawMarkets[index].bidSize)
      expect(askSize).to.be.eq(rawMarkets[index].askSize)
      expect(count).to.be.eq(rawMarkets[index].count)

      expect(baseCurrency).to.be.ok
      expect(quoteCurrency).to.be.ok
      expect(`${baseCurrency}${quoteCurrency}`)
        .to.be.eq(rawMarkets[index].symbol)

    })

  })

})
