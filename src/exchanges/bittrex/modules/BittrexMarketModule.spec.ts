import { expect } from 'chai'
import { ImportMock } from 'ts-mock-imports'

import { IAlunaMarketSchema } from '../../../lib/schemas/IAlunaMarketSchema'
import { Bittrex } from '../Bittrex'
import { BittrexHttp } from '../BittrexHttp'
import { PROD_BITTREX_URL } from '../BittrexSpecs'
import { BittrexMarketParser } from '../schemas/parses/BittrexMarketParser'
import { BittrexTickerMarketParser } from '../schemas/parses/BittrexTickerMarketParser'
import {
  BITTREX_PARSED_MARKETS,
  BITTREX_RAW_MARKETS_WITH_TICKER,
} from '../test/fixtures/bittrexMarket'
import { BittrexMarketModule } from './BittrexMarketModule'



describe('BittrexMarketModule', () => {


  it('should list Bittrex raw markets just fine', async () => {

    const rawMarketSummaries = 'rawMarketSummaries'
    const rawMarketTickers = 'rawMarketSummaries'

    const marketSummariesURL = `${PROD_BITTREX_URL}/markets/summaries`
    const marketTickersURL = `${PROD_BITTREX_URL}/markets/tickers`

    const requestMock = ImportMock.mockFunction(
      BittrexHttp,
      'publicRequest',
    )

    requestMock
      .onFirstCall().returns(Promise.resolve(rawMarketSummaries))
    requestMock
      .onSecondCall().returns(Promise.resolve(rawMarketTickers))


    const ticketMarketParserMock = ImportMock.mockFunction(
      BittrexTickerMarketParser,
      'parse',
      BITTREX_RAW_MARKETS_WITH_TICKER,
    )


    const response = await BittrexMarketModule.listRaw()


    expect(requestMock.callCount).to.be.eq(2)
    expect(requestMock.firstCall.calledWith(
      { url: marketSummariesURL },
    )).to.be.ok
    expect(requestMock.secondCall.calledWith(
      { url: marketTickersURL },
    )).to.be.ok

    expect(ticketMarketParserMock.callCount).to.be.eq(1)
    expect(ticketMarketParserMock.calledWith({
      rawMarketSummaries,
      rawMarketTickers,
    })).to.be.ok

    expect(response.length).to.eq(3)
    expect(response).to.deep.eq(BITTREX_RAW_MARKETS_WITH_TICKER)

  })



  it('should list Bittrex parsed markets just fine', async () => {

    const rawListMock = 'rawListMock'

    const listRawMock = ImportMock.mockFunction(
      BittrexMarketModule,
      'listRaw',
      rawListMock,
    )

    const parseManyMock = ImportMock.mockFunction(
      BittrexMarketModule,
      'parseMany',
      BITTREX_PARSED_MARKETS,
    )

    const parsedMarkets = await BittrexMarketModule.list()

    expect(listRawMock.callCount).to.eq(1)

    expect(parseManyMock.callCount).to.eq(1)
    expect(parseManyMock.calledWith({
      rawMarkets: rawListMock,
    }))

    expect(parsedMarkets.length).to.eq(3)
    expect(parsedMarkets).to.deep.eq(BITTREX_PARSED_MARKETS)

  })



  it('should parse a Bittrex market just fine', async () => {

    const parsedMarketMock = BITTREX_PARSED_MARKETS[0]

    const marketParserMock = ImportMock.mockFunction(
      BittrexMarketParser,
      'parse',
      parsedMarketMock,
    )

    const rawMarketWithTicker = BITTREX_RAW_MARKETS_WITH_TICKER[0]

    const market: IAlunaMarketSchema = BittrexMarketModule.parse({
      rawMarket: rawMarketWithTicker,
    })

    expect(marketParserMock.callCount).to.be.eq(1)

    const { ticker } = market

    expect(market).to.deep.eq(parsedMarketMock)

    expect(market.exchangeId).to.be.eq(Bittrex.ID)
    expect(market.symbolPair).to.be.eq(parsedMarketMock.symbolPair)
    expect(market.baseSymbolId).to.be.eq(parsedMarketMock.baseSymbolId)
    expect(market.quoteSymbolId).to.be.eq(parsedMarketMock.quoteSymbolId)


    const {
      askRate,
      bidRate,
      high: highPrice,
      lastTradeRate,
      low: lowPrice,
      percentChange,
      volume: baseVolume,
      quoteVolume,
    } = rawMarketWithTicker

    const high = parseFloat(highPrice)
    const low = parseFloat(lowPrice)
    const bid = parseFloat(bidRate)
    const ask = parseFloat(askRate)
    const lastTradePrice = parseFloat(lastTradeRate)
    const change = parseFloat(percentChange) / 100
    const volume = parseFloat(baseVolume)

    expect(ticker).to.be.ok
    expect(ticker.high).to.be.eq(high)
    expect(ticker.low).to.be.eq(low)
    expect(ticker.bid).to.be.eq(bid)
    expect(ticker.ask).to.be.eq(ask)
    expect(ticker.last).to.be.eq(lastTradePrice)
    expect(ticker.change).to.be.eq(change)
    expect(ticker.baseVolume).to.be.eq(volume)
    expect(ticker.quoteVolume).to.be.eq(parseFloat(quoteVolume))

    expect(market.spotEnabled).to.be.ok
    expect(market.marginEnabled).to.not.be.ok
    expect(market.derivativesEnabled).not.to.be.ok

  })



  it('should parse many Bittrex markets just fine', async () => {

    const parseMock = ImportMock.mockFunction(
      BittrexMarketModule,
      'parse',
    )

    parseMock
      .onFirstCall()
      .returns(BITTREX_PARSED_MARKETS[0])
      .onSecondCall()
      .returns(BITTREX_PARSED_MARKETS[1])
      .onThirdCall()
      .returns(BITTREX_PARSED_MARKETS[2])


    const markets: IAlunaMarketSchema[] = BittrexMarketModule.parseMany({
      rawMarkets: BITTREX_RAW_MARKETS_WITH_TICKER,
    })

    markets.forEach((market, index) => {

      const {
        baseSymbolId,
        quoteSymbolId,
        symbolPair,
      } = BITTREX_PARSED_MARKETS[index]

      expect(market.exchangeId).to.be.eq(Bittrex.ID)
      expect(market.symbolPair).to.be.eq(symbolPair)
      expect(market.baseSymbolId).to.be.eq(baseSymbolId)
      expect(market.quoteSymbolId).to.be.eq(quoteSymbolId)

    })

  })

})
