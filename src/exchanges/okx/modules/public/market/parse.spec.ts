import { expect } from 'chai'

import { mockTranslateSymbolId } from '../../../../../utils/mappings/translateSymbolId.mock'
import { Okx } from '../../../Okx'
import { OKX_RAW_MARKETS } from '../../../test/fixtures/okxMarket'
import { OKX_RAW_SYMBOLS } from '../../../test/fixtures/okxSymbols'



describe(__filename, () => {

  it('should parse a Okx raw market just fine', async () => {

    // preparing data
    const rawMarket = OKX_RAW_MARKETS[0]

    const rawSpotSymbol = OKX_RAW_SYMBOLS[0]

    const rawMarketRequest = {
      rawMarket,
      rawSpotSymbol,
    }

    const {
      askPx,
      bidPx,
      high24h,
      instId,
      last,
      low24h,
      open24h,
      vol24h,
      volCcy24h,
    } = rawMarket

    const [
      baseCurrency,
      quoteCurrency,
    ] = instId.split('-')

    const change = Number(open24h) - Number(last)

    // mocking
    const { translateSymbolId } = mockTranslateSymbolId()

    translateSymbolId.onFirstCall().returns(baseCurrency)
    translateSymbolId.onSecondCall().returns(quoteCurrency)


    // executing
    const exchange = new Okx({})

    const { market } = exchange.market.parse({
      rawMarket: rawMarketRequest,
    })


    // validating
    expect(market).to.exist

    expect(market.exchangeId).to.be.eq(exchange.specs.id)
    expect(market.baseSymbolId).to.be.eq(baseCurrency)
    expect(market.quoteSymbolId).to.be.eq(quoteCurrency)
    expect(market.symbolPair).to.be.eq(instId)

    expect(market.ticker.ask).to.be.eq(Number(askPx))
    expect(market.ticker.bid).to.be.eq(Number(bidPx))
    expect(market.ticker.high).to.be.eq(Number(high24h))
    expect(market.ticker.low).to.be.eq(Number(low24h))
    expect(market.ticker.last).to.be.eq(Number(last))
    expect(market.ticker.change).to.be.eq(change)
    expect(market.ticker.baseVolume).to.be.eq(Number(vol24h))
    expect(market.ticker.quoteVolume).to.be.eq(Number(volCcy24h))

    expect(market.spotEnabled).to.be.ok
    expect(market.marginEnabled).not.to.be.ok
    expect(market.leverageEnabled).not.to.be.ok
    expect(market.derivativesEnabled).not.to.be.ok

  })

})
