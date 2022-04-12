import { expect } from 'chai'
import { ImportMock } from 'ts-mock-imports'

import { Gateio } from '../Gateio'
import { GateioHttp } from '../GateioHttp'
import { PROD_GATEIO_URL } from '../GateioSpecs'
import { GateioMarketParser } from '../schemas/parsers/GateioMarketParser'
import {
  GATEIO_PARSED_MARKETS,
  GATEIO_RAW_MARKETS,
} from '../test/fixtures/gateioMarket'
import { GateioMarketModule } from './GateioMarketModule'



describe('GateioMarketModule', () => {


  it('should list Gateio raw markets just fine', async () => {

    const marketsURL = `${PROD_GATEIO_URL}/spot/tickers`

    const requestMock = ImportMock.mockFunction(
      GateioHttp,
      'publicRequest',
    )

    requestMock
      .onFirstCall().returns(Promise.resolve({
        data: GATEIO_RAW_MARKETS,
        requestCount: 1,
      }))

    const { rawMarkets } = await GateioMarketModule.listRaw()

    expect(requestMock.callCount).to.be.eq(1)
    expect(requestMock.firstCall.calledWith({ url: marketsURL })).to.be.ok

    expect(rawMarkets.length).to.eq(4)
    expect(rawMarkets).to.deep.eq(GATEIO_RAW_MARKETS)

  })



  it('should list Gateio parsed markets just fine', async () => {

    const rawListMock = 'rawListMock'

    const listRawMock = ImportMock.mockFunction(
      GateioMarketModule,
      'listRaw',
      { rawMarkets: rawListMock, requestCount: 1 },
    )

    const parseManyMock = ImportMock.mockFunction(
      GateioMarketModule,
      'parseMany',
      { markets: GATEIO_PARSED_MARKETS, requestCount: 1 },
    )

    const { markets: parsedMarkets } = await GateioMarketModule.list()

    expect(listRawMock.callCount).to.eq(1)

    expect(parseManyMock.callCount).to.eq(1)
    expect(parseManyMock.calledWith({
      rawMarkets: rawListMock,
    }))

    expect(parsedMarkets.length).to.eq(4)
    expect(parsedMarkets).to.deep.eq(GATEIO_PARSED_MARKETS)

  })



  it('should parse a Gateio market just fine', async () => {

    const parsedMarketMock = GATEIO_PARSED_MARKETS[0]

    const marketParserMock = ImportMock.mockFunction(
      GateioMarketParser,
      'parse',
      parsedMarketMock,
    )

    const rawMarketWithCurrency = GATEIO_RAW_MARKETS[0]

    const { market } = GateioMarketModule.parse({
      rawMarket: rawMarketWithCurrency,
    })

    expect(marketParserMock.callCount).to.be.eq(1)

    const { ticker } = market

    expect(market).to.deep.eq(parsedMarketMock)

    expect(market.exchangeId).to.be.eq(Gateio.ID)
    expect(market.symbolPair).to.be.eq(parsedMarketMock.symbolPair)
    expect(market.baseSymbolId).to.be.eq(parsedMarketMock.baseSymbolId)
    expect(market.quoteSymbolId).to.be.eq(parsedMarketMock.quoteSymbolId)


    const {
      high_24h,
      low_24h,
      highest_bid,
      lowest_ask,
      last,
      change_percentage,
      base_volume,
      quote_volume,
    } = rawMarketWithCurrency

    const high = parseFloat(high_24h)
    const low = parseFloat(low_24h)
    const bid = parseFloat(highest_bid)
    const ask = parseFloat(lowest_ask)
    const lastTradePrice = parseFloat(last)
    const change = parseFloat(change_percentage)
    const volume = parseFloat(base_volume)
    const quoteVolume = parseFloat(quote_volume)

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



  it('should parse many Gateio markets just fine', async () => {

    const parseMock = ImportMock.mockFunction(
      GateioMarketModule,
      'parse',
    )

    parseMock
      .onFirstCall()
      .returns({ market: GATEIO_PARSED_MARKETS[0], requestCount: 1 })
      .onSecondCall()
      .returns({ market: GATEIO_PARSED_MARKETS[1], requestCount: 1 })
      .onThirdCall()
      .returns({ market: GATEIO_PARSED_MARKETS[2], requestCount: 1 })


    const { markets } = GateioMarketModule.parseMany({
      rawMarkets: GATEIO_RAW_MARKETS.slice(0, 2),
    })

    markets.forEach((market, index) => {

      const {
        baseSymbolId,
        quoteSymbolId,
        symbolPair,
      } = GATEIO_PARSED_MARKETS[index]

      expect(market.exchangeId).to.be.eq(Gateio.ID)
      expect(market.symbolPair).to.be.eq(symbolPair)
      expect(market.baseSymbolId).to.be.eq(baseSymbolId)
      expect(market.quoteSymbolId).to.be.eq(quoteSymbolId)

    })

  })

})
