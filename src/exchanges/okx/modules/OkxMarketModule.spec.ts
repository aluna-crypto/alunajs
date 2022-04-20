import { expect } from 'chai'
import { ImportMock } from 'ts-mock-imports'

import { Okx } from '../Okx'
import { OkxHttp } from '../OkxHttp'
import { PROD_OKX_URL } from '../OkxSpecs'
import { OkxMarketParser } from '../schemas/parsers/OkxMarketParser'
import {
  OKX_PARSED_MARKETS,
  OKX_RAW_MARKETS,
} from '../test/fixtures/okxMarket'
import { OkxMarketModule } from './OkxMarketModule'



describe('OkxMarketModule', () => {


  it('should list Okx raw markets just fine', async () => {

    const marketsURL = `${PROD_OKX_URL}/market/tickers?instType=SPOT`

    const requestMock = ImportMock.mockFunction(
      OkxHttp,
      'publicRequest',
    )

    requestMock
      .onFirstCall().returns(Promise.resolve({
        data: OKX_RAW_MARKETS,
        requestCount: 1,
      }))

    const {
      rawMarkets: response,
      requestCount,
    } = await OkxMarketModule.listRaw()
    expect(requestCount).to.be.eq(1)
    expect(requestMock.callCount).to.be.eq(1)
    expect(requestMock.calledWith({ url: marketsURL })).to.be.ok

    expect(response.length).to.eq(3)
    expect(response).to.deep.eq(OKX_RAW_MARKETS)

  })



  it('should list Okx parsed markets just fine', async () => {

    const rawListMock = 'rawListMock'

    const listRawMock = ImportMock.mockFunction(
      OkxMarketModule,
      'listRaw',
      { rawMarkets: rawListMock, requestCount: 0 },
    )

    const parseManyMock = ImportMock.mockFunction(
      OkxMarketModule,
      'parseMany',
      { markets: OKX_PARSED_MARKETS, requestCount: 0 },
    )

    const { markets: parsedMarkets } = await OkxMarketModule.list()

    expect(listRawMock.callCount).to.eq(1)

    expect(parseManyMock.callCount).to.eq(1)
    expect(parseManyMock.calledWith({
      rawMarkets: rawListMock,
    }))

    expect(parsedMarkets.length).to.eq(3)
    expect(parsedMarkets).to.deep.eq(OKX_PARSED_MARKETS)

  })



  it('should parse a Okx market just fine', async () => {

    const parsedMarketMock = OKX_PARSED_MARKETS[0]

    const marketParserMock = ImportMock.mockFunction(
      OkxMarketParser,
      'parse',
      parsedMarketMock,
    )

    const rawMarketWithCurrency = OKX_RAW_MARKETS[0]

    const { market } = OkxMarketModule.parse({
      rawMarket: rawMarketWithCurrency,
    })

    expect(marketParserMock.callCount).to.be.eq(1)

    const { ticker } = market

    expect(market).to.deep.eq(parsedMarketMock)

    expect(market.exchangeId).to.be.eq(Okx.ID)
    expect(market.symbolPair).to.be.eq(parsedMarketMock.symbolPair)
    expect(market.baseSymbolId).to.be.eq(parsedMarketMock.baseSymbolId)
    expect(market.quoteSymbolId).to.be.eq(parsedMarketMock.quoteSymbolId)


    const {
      askPx,
      bidPx,
      high24h,
      last,
      low24h,
      open24h,
      vol24h,
      volCcy24h,
    } = rawMarketWithCurrency

    const high = parseFloat(high24h)
    const low = parseFloat(low24h)
    const bid = parseFloat(bidPx)
    const ask = parseFloat(askPx)
    const lastTradePrice = parseFloat(last)
    const change = parseFloat(open24h) - parseFloat(last)
    const volume = parseFloat(vol24h)
    const quoteVolume = parseFloat(volCcy24h)

    expect(ticker).to.be.ok
    expect(ticker.high).to.be.eq(high)
    expect(ticker.low).to.be.eq(low)
    expect(ticker.bid).to.be.eq(bid)
    expect(ticker.ask).to.be.eq(ask)
    expect(ticker.last).to.be.eq(lastTradePrice)
    expect(ticker.change).to.be.eq(change)
    expect(ticker.baseVolume).to.be.eq(volume)
    expect(ticker.quoteVolume).to.be.eq(quoteVolume)

    expect(market.spotEnabled).to.be.ok
    expect(market.marginEnabled).not.to.be.ok
    expect(market.derivativesEnabled).not.to.be.ok

  })



  it('should parse many Okx markets just fine', async () => {

    const parseMock = ImportMock.mockFunction(
      OkxMarketModule,
      'parse',
    )

    parseMock
      .onFirstCall()
      .returns({ market: OKX_PARSED_MARKETS[0], requestCount: 0 })
      .onSecondCall()
      .returns({ market: OKX_PARSED_MARKETS[1], requestCount: 0 })
      .onThirdCall()
      .returns({ market: OKX_PARSED_MARKETS[2], requestCount: 0 })

    const { markets } = OkxMarketModule.parseMany({
      rawMarkets: OKX_RAW_MARKETS,
    })

    markets.forEach((market, index) => {

      const {
        baseSymbolId,
        quoteSymbolId,
        symbolPair,
      } = OKX_PARSED_MARKETS[index]

      expect(market.exchangeId).to.be.eq(Okx.ID)
      expect(market.symbolPair).to.be.eq(symbolPair)
      expect(market.baseSymbolId).to.be.eq(baseSymbolId)
      expect(market.quoteSymbolId).to.be.eq(quoteSymbolId)

    })

  })

})
