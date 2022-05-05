import { expect } from 'chai'

import { mockTranslateSymbolId } from '../../../../../utils/mappings/translateSymbolId.mock'
import { Valr } from '../../../Valr'
import { VALR_RAW_CURRENCY_PAIRS, VALR_RAW_MARKETS } from '../../../test/fixtures/valrMarket'
import { valrBaseSpecs } from '../../../valrSpecs'



describe(__filename, () => {

  it('should parse a Valr raw market just fine', async () => {

    // preparing data
    const translatedSymbolId = 'BTC'
    const summary = VALR_RAW_MARKETS[0]
    const pair = VALR_RAW_CURRENCY_PAIRS[0]

    const rawMarket = {
      summary,
      pair,
    }

    const {
      currencyPair,
      askPrice,
      baseVolume,
      bidPrice,
      changeFromPrevious,
      highPrice,
      lastTradedPrice,
      lowPrice,
    } = summary

    const ticker = {
      ask: Number(askPrice),
      baseVolume: Number(baseVolume),
      bid: Number(bidPrice),
      change: Number(changeFromPrevious),
      date: new Date(),
      high: Number(highPrice),
      last: Number(lastTradedPrice),
      low: Number(lowPrice),
      quoteVolume: 0,
    }

    const { baseCurrency, quoteCurrency } = pair


    // mocking

    const { translateSymbolId } = mockTranslateSymbolId()

    translateSymbolId.returns(translatedSymbolId)


    // executing
    const exchange = new Valr({})

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

    expect(market.exchangeId).to.be.eq(valrBaseSpecs.id)
    expect(market.symbolPair).to.be.eq(currencyPair)
    expect(market.meta).to.deep.eq(rawMarket)

    expect(market.derivativesEnabled).not.to.be.ok
    expect(market.marginEnabled).not.to.be.ok
    expect(market.leverageEnabled).not.to.be.ok
    expect(market.spotEnabled).to.be.ok

  })

})
