import { expect } from 'chai'
import { ImportMock } from 'ts-mock-imports'

import { Ftx } from '../Ftx'
import { FtxHttp } from '../FtxHttp'
import { PROD_FTX_URL } from '../FtxSpecs'
import { FtxMarketParser } from '../schemas/parsers/FtxMarketParser'
import {
  FTX_PARSED_MARKETS,
  FTX_RAW_MARKETS,
} from '../test/fixtures/ftxMarket'
import { FtxMarketModule } from './FtxMarketModule'



describe('FtxMarketModule', () => {


  it('should list Ftx raw markets just fine', async () => {

    const marketsURL = `${PROD_FTX_URL}/markets`

    const requestMock = ImportMock.mockFunction(
      FtxHttp,
      'publicRequest',
    )

    requestMock
      .onFirstCall()
      .returns(Promise.resolve({
        data: { result: FTX_RAW_MARKETS },
        apiRequestCount: 1,
      }))

    const { rawMarkets: response } = await FtxMarketModule.listRaw()

    expect(requestMock.callCount).to.be.eq(1)
    expect(requestMock.firstCall.calledWith({ url: marketsURL })).to.be.ok

    expect(response.length).to.eq(3)
    expect(response).to.deep.eq(FTX_RAW_MARKETS)

  })



  it('should list Ftx parsed markets just fine', async () => {

    const rawListMock = 'rawListMock'

    const listRawMock = ImportMock.mockFunction(
      FtxMarketModule,
      'listRaw',
      {
        rawMarkets: rawListMock,
        apiRequestCount: 1,
      },
    )

    const parseManyMock = ImportMock.mockFunction(
      FtxMarketModule,
      'parseMany',
      {
        markets: FTX_PARSED_MARKETS,
        apiRequestCount: 1,
      },
    )

    const { markets: parsedMarkets } = await FtxMarketModule.list()

    expect(listRawMock.callCount).to.eq(1)

    expect(parseManyMock.callCount).to.eq(1)
    expect(parseManyMock.calledWith({
      rawMarkets: rawListMock,
    }))

    expect(parsedMarkets.length).to.eq(3)
    expect(parsedMarkets).to.deep.eq(FTX_PARSED_MARKETS)

  })



  it('should parse a Ftx market just fine', async () => {

    const parsedMarketMock = FTX_PARSED_MARKETS[0]

    const marketParserMock = ImportMock.mockFunction(
      FtxMarketParser,
      'parse',
      parsedMarketMock,
    )

    const rawMarket = FTX_RAW_MARKETS[0]

    const { market } = FtxMarketModule.parse({
      rawMarket,
    })

    expect(marketParserMock.callCount).to.be.eq(1)

    const { ticker } = market

    expect(market).to.deep.eq(parsedMarketMock)

    expect(market.exchangeId).to.be.eq(Ftx.ID)
    expect(market.symbolPair).to.be.eq(parsedMarketMock.symbolPair)
    expect(market.baseSymbolId).to.be.eq(parsedMarketMock.baseSymbolId)
    expect(market.quoteSymbolId).to.be.eq(parsedMarketMock.quoteSymbolId)


    const {
      price,
      ask,
      last,
      bid,
      change24h,
      volumeUsd24h,
      quoteVolume24h,
    } = rawMarket

    expect(ticker).to.be.ok
    expect(ticker.high).to.be.eq(price)
    expect(ticker.low).to.be.eq(price)
    expect(ticker.bid).to.be.eq(bid)
    expect(ticker.ask).to.be.eq(ask)
    expect(ticker.last).to.be.eq(last)
    expect(ticker.change).to.be.eq(change24h)
    expect(ticker.baseVolume).to.be.eq(volumeUsd24h)
    expect(ticker.quoteVolume).to.be.eq(quoteVolume24h)

    expect(market.spotEnabled).to.be.ok
    expect(market.marginEnabled).not.to.be.ok
    expect(market.derivativesEnabled).not.to.be.ok

  })



  it('should parse many Ftx markets just fine', async () => {

    const parseMock = ImportMock.mockFunction(
      FtxMarketModule,
      'parse',
    )

    parseMock
      .onFirstCall()
      .returns({
        market: FTX_PARSED_MARKETS[0],
        apiRequestCount: 1,
      })
      .onSecondCall()
      .returns({
        market: FTX_PARSED_MARKETS[1],
        apiRequestCount: 1,
      })
      .onThirdCall()
      .returns({
        market: FTX_PARSED_MARKETS[2],
        apiRequestCount: 1,
      })


    const { markets } = FtxMarketModule.parseMany({
      rawMarkets: FTX_RAW_MARKETS,
    })

    markets.forEach((market, index) => {

      const {
        baseSymbolId,
        quoteSymbolId,
        symbolPair,
      } = FTX_PARSED_MARKETS[index]

      expect(market.exchangeId).to.be.eq(Ftx.ID)
      expect(market.symbolPair).to.be.eq(symbolPair)
      expect(market.baseSymbolId).to.be.eq(baseSymbolId)
      expect(market.quoteSymbolId).to.be.eq(quoteSymbolId)

    })

  })

})
