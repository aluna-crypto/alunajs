import { expect } from 'chai'

import { GATEIO_RAW_MARKETS } from '../../test/fixtures/gateioMarket'
import { GateioCurrencyMarketParser } from './GateioCurrencyMarketParser'



describe('GateioCurrencyMarketParser', () => {

  it('should parse Gateio currency pairs just fine', () => {

    const rawMarkets = GATEIO_RAW_MARKETS

    const marketWithCurr = GateioCurrencyMarketParser.parse({
      rawMarkets,
    })

    expect(rawMarkets.length).to.be.eq(4)
    expect(marketWithCurr.length).to.be.eq(4)

    marketWithCurr.forEach((item, index) => {

      const {
        base_volume,
        change_percentage,
        currency_pair,
        etf_leverage,
        etf_net_value,
        etf_pre_net_value,
        etf_pre_timestamp,
        high_24h,
        highest_bid,
        last,
        low_24h,
        lowest_ask,
        quote_volume,
        baseCurrency,
        quoteCurrency,
      } = item

      expect(base_volume).to.be.eq(rawMarkets[index].base_volume)
      expect(change_percentage).to.be.eq(rawMarkets[index].change_percentage)
      expect(currency_pair).to.be.eq(rawMarkets[index].currency_pair)
      expect(quote_volume).to.be.eq(rawMarkets[index].quote_volume)
      expect(base_volume).to.be.eq(rawMarkets[index].base_volume)
      expect(lowest_ask).to.be.eq(rawMarkets[index].lowest_ask)
      expect(highest_bid).to.be.eq(rawMarkets[index].highest_bid)
      expect(last).to.be.eq(rawMarkets[index].last)
      expect(low_24h).to.be.eq(rawMarkets[index].low_24h)
      expect(high_24h).to.be.eq(rawMarkets[index].high_24h)
      expect(etf_leverage).to.be.eq(rawMarkets[index].etf_leverage)
      expect(etf_net_value).to.be.eq(rawMarkets[index].etf_net_value)
      expect(etf_pre_net_value).to.be.eq(rawMarkets[index].etf_pre_net_value)
      expect(etf_pre_timestamp).to.be.eq(rawMarkets[index].etf_pre_timestamp)

      expect(baseCurrency).to.be.ok
      expect(quoteCurrency).to.be.ok
      expect(`${baseCurrency}_${quoteCurrency}`)
        .to.be.eq(rawMarkets[index].currency_pair)

    })

  })

})
