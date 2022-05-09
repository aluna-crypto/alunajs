import { expect } from 'chai'
import { IAlunaMarketSchema } from '../../../../../lib/schemas/IAlunaMarketSchema'

import { mockTranslateSymbolId } from '../../../../../utils/mappings/translateSymbolId.mock'
import { Gate } from '../../../Gate'
import { gateBaseSpecs } from '../../../gateSpecs'
import { GATE_RAW_MARKETS } from '../../../test/fixtures/gateMarket'



describe(__filename, () => {

  it('should parse a Gate raw market just fine', async () => {

    // preparing data
    const rawMarket = GATE_RAW_MARKETS[0]

    const {
      base_volume: baseVolume,
      change_percentage: changePercentage,
      currency_pair: currencyPair,
      high_24h: high24h,
      highest_bid: highestBid,
      last,
      low_24h: low24h,
      lowest_ask: lowestAsk,
      quote_volume: quoteVolume,
    } = rawMarket

    const [baseCurrency, quoteCurrency] = currencyPair.split('_')

    const ticker = {
      high: Number(high24h),
      low: Number(low24h),
      bid: Number(highestBid),
      ask: Number(lowestAsk),
      last: Number(last),
      date: new Date(),
      change: Number(changePercentage),
      baseVolume: Number(baseVolume),
      quoteVolume: Number(quoteVolume),
    }

    const parsedMarket: IAlunaMarketSchema = {
      exchangeId: gateBaseSpecs.id,
      symbolPair: currencyPair,
      baseSymbolId: baseCurrency,
      quoteSymbolId: quoteCurrency,
      ticker,
      spotEnabled: true,
      marginEnabled: false,
      derivativesEnabled: false,
      leverageEnabled: false,
      meta: rawMarket,
    }

    // mocking
    const { translateSymbolId } = mockTranslateSymbolId()

    translateSymbolId.onFirstCall().returns(baseCurrency)

    translateSymbolId.onSecondCall().returns(quoteCurrency)

    // executing
    const exchange = new Gate({})

    const { market } = exchange.market.parse({
      rawMarket,
    })

    // validating
    expect(market).to.exist

    expect(market.baseSymbolId).to.be.eq(baseCurrency)
    expect(market.quoteSymbolId).to.be.eq(quoteCurrency)

    expect(market.ticker.ask).to.be.eq(ticker.ask)
    expect(market.ticker.baseVolume).to.be.eq(ticker.baseVolume)
    expect(market.ticker.bid).to.be.eq(ticker.bid)
    expect(market.ticker.change).to.be.eq(ticker.change)
    expect(market.ticker.high).to.be.eq(ticker.high)
    expect(market.ticker.last).to.be.eq(ticker.last)
    expect(market.ticker.low).to.be.eq(ticker.low)
    expect(market.ticker.quoteVolume).to.be.eq(ticker.quoteVolume)

    expect(market.exchangeId).to.be.eq(gateBaseSpecs.id)
    expect(market.symbolPair).to.be.eq(currencyPair)
    expect(market.meta).to.deep.eq(rawMarket)

    expect(market.derivativesEnabled).not.to.be.ok
    expect(market.marginEnabled).not.to.be.ok
    expect(market.leverageEnabled).not.to.be.ok
    expect(market.spotEnabled).to.be.ok

  })

})
