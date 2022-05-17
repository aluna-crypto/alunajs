import { expect } from 'chai'

import { mockTranslateSymbolId } from '../../../../../utils/mappings/translateSymbolId.mock'
import { Poloniex } from '../../../Poloniex'
import { poloniexBaseSpecs } from '../../../poloniexSpecs'
import { POLONIEX_RAW_MARKETS } from '../../../test/fixtures/poloniexMarket'



describe(__filename, () => {

  it('should parse a Poloniex raw market just fine', async () => {

    // preparing data
    const rawMarket = POLONIEX_RAW_MARKETS[0]

    const {
      baseCurrency,
      quoteCurrency,
      quoteVolume,
      baseVolume,
      currencyPair,
      high24hr,
      highestBid,
      last,
      low24hr,
      lowestAsk,
      percentChange,
    } = rawMarket

    const ticker = {
      high: Number(high24hr),
      low: Number(low24hr),
      bid: Number(highestBid),
      ask: Number(lowestAsk),
      last: Number(last),
      change: Number(percentChange),
      // Poloniex 'base' and 'quote' currency are inverted
      baseVolume: Number(quoteVolume),
      quoteVolume: Number(baseVolume),
    }

    // mocking
    const { translateSymbolId } = mockTranslateSymbolId()

    translateSymbolId.onFirstCall().returns(baseCurrency)
    translateSymbolId.onSecondCall().returns(quoteCurrency)


    // executing
    const exchange = new Poloniex({})

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

    expect(market.exchangeId).to.be.eq(poloniexBaseSpecs.id)
    expect(market.symbolPair).to.be.eq(currencyPair)
    expect(market.meta).to.deep.eq(rawMarket)

    expect(market.derivativesEnabled).not.to.be.ok
    expect(market.marginEnabled).not.to.be.ok
    expect(market.leverageEnabled).not.to.be.ok
    expect(market.spotEnabled).to.be.ok

  })

})
