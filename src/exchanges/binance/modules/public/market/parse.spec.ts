import { expect } from 'chai'

import { mockTranslateSymbolId } from '../../../../../utils/mappings/translateSymbolId.mock'
import { Binance } from '../../../Binance'
import { binanceBaseSpecs } from '../../../binanceSpecs'
import { BINANCE_RAW_MARKETS } from '../../../test/fixtures/binanceMarket'
import { BINANCE_RAW_SYMBOLS } from '../../../test/fixtures/binanceSymbols'



describe(__filename, () => {

  it('should parse a Binance raw market just fine', async () => {

    // preparing data
    const rawTicker = BINANCE_RAW_MARKETS[0]
    const rawSymbol = BINANCE_RAW_SYMBOLS[0]

    const rawMarket = {
      rawTicker,
      rawSymbol,
    }

    const {
      baseAsset,
      quoteAsset,
      isSpotTradingAllowed,
      isMarginTradingAllowed,
    } = rawSymbol

    const {
      askPrice,
      volume,
      bidPrice,
      highPrice,
      lastPrice,
      lowPrice,
      priceChange,
      quoteVolume,
      symbol,
    } = rawTicker

    const ticker = {
      high: parseFloat(highPrice),
      low: parseFloat(lowPrice),
      bid: parseFloat(bidPrice),
      ask: parseFloat(askPrice),
      last: parseFloat(lastPrice),
      change: parseFloat(priceChange) / 100,
      baseVolume: parseFloat(volume),
      quoteVolume: parseFloat(quoteVolume),
    }

    // mocking
    const { translateSymbolId } = mockTranslateSymbolId()

    translateSymbolId.onFirstCall().returns(baseAsset)
    translateSymbolId.onSecondCall().returns(quoteAsset)


    // executing
    const exchange = new Binance({})

    const { market } = exchange.market.parse({
      rawMarket,
    })


    // validating
    expect(market.ticker.ask).to.be.eq(ticker.ask)
    expect(market.ticker.bid).to.be.eq(ticker.bid)
    expect(market.ticker.high).to.be.eq(ticker.high)
    expect(market.ticker.low).to.be.eq(ticker.low)
    expect(market.ticker.last).to.be.eq(ticker.last)
    expect(market.ticker.quoteVolume).to.be.eq(ticker.quoteVolume)
    expect(market.ticker.baseVolume).to.be.eq(ticker.baseVolume)
    expect(market.ticker.change).to.be.eq(ticker.change)

    expect(market.symbolPair).to.be.eq(symbol)
    expect(market.baseSymbolId).to.be.eq(baseAsset)
    expect(market.quoteSymbolId).to.be.eq(quoteAsset)
    expect(market.exchangeId).to.be.eq(binanceBaseSpecs.id)
    expect(market.marginEnabled).to.be.eq(isMarginTradingAllowed)
    expect(market.spotEnabled).to.be.eq(isSpotTradingAllowed)
    expect(market.derivativesEnabled).not.to.be.ok
    expect(market.leverageEnabled).not.to.be.ok

    expect(market.meta).to.deep.eq(rawMarket)

  })

})
