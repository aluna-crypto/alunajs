import { expect } from 'chai'
import { ImportMock } from 'ts-mock-imports'

import { ValrCurrencyPairsParser } from '../schemas/parsers/ValrCurrencyPairsParser'
import { ValrMarketParser } from '../schemas/parsers/ValrMarketParser'
import {
  VALR_PARSED_MARKETS,
  VALR_RAW_CURRENCY_PAIRS,
  VALR_RAW_MARKETS,
  VALR_RAW_MARKETS_WITH_CURRENCY,
} from '../test/fixtures/valrMarket'
import { Valr } from '../Valr'
import { ValrHttp } from '../ValrHttp'
import { ValrMarketModule } from './ValrMarketModule'



describe('ValrMarketModule', () => {

  it('should list Valr raw markets just fine', async () => {

    const mockRawMarkets = 'rawMarkets'
    const mockRawCurrencyPairs = 'rawCurrencyPairs'

    const fetchMarketsMock = ImportMock.mockFunction(
      ValrMarketModule,
      'fetchMarkets',
      Promise.resolve({
        markets: mockRawMarkets,
        requestCount: 1,
      }),
    )

    const fetchCurrencyPairsMock = ImportMock.mockFunction(
      ValrMarketModule,
      'fetchCurrencyPairs',
      Promise.resolve({
        currencyPairs: mockRawCurrencyPairs,
        requestCount: 1,
      }),
    )

    const currencyPairsParseMock = ImportMock.mockFunction(
      ValrCurrencyPairsParser,
      'parse',
      VALR_RAW_MARKETS_WITH_CURRENCY,
    )

    const { rawMarkets } = await ValrMarketModule.listRaw()

    expect(fetchMarketsMock.callCount).to.be.eq(1)
    expect(fetchCurrencyPairsMock.callCount).to.be.eq(1)

    expect(currencyPairsParseMock.callCount).to.be.eq(1)
    expect(currencyPairsParseMock.calledWith({
      rawMarkets: mockRawMarkets,
      rawCurrencyPairs: mockRawCurrencyPairs,
    })).to.be.ok

    expect(rawMarkets.length).to.eq(3)
    expect(rawMarkets).to.deep.eq(VALR_RAW_MARKETS_WITH_CURRENCY)

    rawMarkets.forEach((res, index) => {

      const {
        currencyPair,
        askPrice,
        bidPrice,
        lastTradedPrice,
        previousClosePrice,
        baseVolume,
        highPrice,
        lowPrice,
        created,
        changeFromPrevious,
        baseCurrency,
        quoteCurrency,
      } = VALR_RAW_MARKETS_WITH_CURRENCY[index]

      expect(res.currencyPair).to.be.eq(currencyPair)
      expect(res.askPrice).to.be.eq(askPrice)
      expect(res.bidPrice).to.be.eq(bidPrice)
      expect(res.lastTradedPrice).to.be.eq(lastTradedPrice)
      expect(res.previousClosePrice).to.be.eq(previousClosePrice)
      expect(res.baseVolume).to.be.eq(baseVolume)
      expect(res.highPrice).to.be.eq(highPrice)
      expect(res.lowPrice).to.be.eq(lowPrice)
      expect(res.created).to.be.eq(created)
      expect(res.changeFromPrevious).to.be.eq(changeFromPrevious)
      expect(res.baseCurrency).to.be.eq(baseCurrency)
      expect(res.quoteCurrency).to.be.eq(quoteCurrency)

    })

  })

  it('should fetch Valr markets just fine', async () => {

    const requestMock = ImportMock.mockFunction(
      ValrHttp,
      'publicRequest',
      {
        data: VALR_RAW_MARKETS,
        requestCount: 1,
      },
    )

    const { markets } = await ValrMarketModule.fetchMarkets()

    expect(markets).to.deep.eq(VALR_RAW_MARKETS)

    expect(requestMock.callCount).to.be.eq(1)
    expect(requestMock.calledWithExactly({
      url: 'https://api.valr.com/v1/public/marketsummary',
    }))

  })

  it('should fetch Valr currency pairs just fine', async () => {

    const requestMock = ImportMock.mockFunction(
      ValrHttp,
      'publicRequest',
      {
        data: VALR_RAW_CURRENCY_PAIRS,
        requestCount: 1,
      },
    )

    const {
      currencyPairs: rawCurrencyPairs,
    } = await ValrMarketModule.fetchCurrencyPairs()

    expect(rawCurrencyPairs).to.deep.eq(VALR_RAW_CURRENCY_PAIRS)

    expect(requestMock.callCount).to.be.eq(1)
    expect(requestMock.calledWithExactly({
      url: 'https://api.valr.com/v1/public/pairs',
    }))

  })

  it('should list Valr parsed markets just fine', async () => {

    const rawListMock = 'rawListMock'

    const listRawMock = ImportMock.mockFunction(
      ValrMarketModule,
      'listRaw',
      {
        rawMarkets: rawListMock,
        requestCount: 1,
      },
    )

    const parseManyMock = ImportMock.mockFunction(
      ValrMarketModule,
      'parseMany',
      {
        markets: VALR_PARSED_MARKETS,
        requestCount: 1,
      },
    )

    const { markets: parsedMarkets } = await ValrMarketModule.list()

    expect(listRawMock.callCount).to.eq(1)

    expect(parseManyMock.callCount).to.eq(1)
    expect(parseManyMock.calledWith({
      rawMarkets: rawListMock,
    }))

    expect(parsedMarkets.length).to.eq(3)
    expect(parsedMarkets).to.deep.eq(VALR_PARSED_MARKETS)

    parsedMarkets.forEach((parsed, index) => {

      const {
        symbolPair,
        baseSymbolId,
        quoteSymbolId,
      } = VALR_PARSED_MARKETS[index]

      expect(parsed.exchangeId).to.eq(Valr.ID)
      expect(parsed.symbolPair).to.be.eq(symbolPair)
      expect(parsed.baseSymbolId).to.be.eq(baseSymbolId)
      expect(parsed.quoteSymbolId).to.be.eq(quoteSymbolId)

    })

  })

  it('should parse a Valr market just fine', async () => {

    const parsedMarketMock = VALR_PARSED_MARKETS[0]

    const marketParserMock = ImportMock.mockFunction(
      ValrMarketParser,
      'parse',
      parsedMarketMock,
    )

    const parsedMarketWithSymbolsMock = VALR_RAW_MARKETS_WITH_CURRENCY[0]

    const { market } = ValrMarketModule.parse({
      rawMarket: parsedMarketWithSymbolsMock,
    })

    expect(marketParserMock.callCount).to.be.eq(1)

    const { ticker } = market

    expect(market).to.deep.eq(parsedMarketMock)

    expect(market.exchangeId).to.be.eq(Valr.ID)
    expect(market.symbolPair).to.be.eq(parsedMarketMock.symbolPair)
    expect(market.baseSymbolId).to.be.eq(parsedMarketMock.baseSymbolId)
    expect(market.quoteSymbolId).to.be.eq(parsedMarketMock.quoteSymbolId)

    const {
      highPrice,
      lowPrice,
      bidPrice,
      askPrice,
      lastTradedPrice,
      changeFromPrevious,
      baseVolume,
    } = parsedMarketWithSymbolsMock

    const high = parseFloat(highPrice)
    const low = parseFloat(lowPrice)
    const bid = parseFloat(bidPrice)
    const ask = parseFloat(askPrice)
    const lastTradePrice = parseFloat(lastTradedPrice)
    const change = parseFloat(changeFromPrevious) / 100
    const volume = parseFloat(baseVolume)

    expect(ticker).to.be.ok
    expect(ticker.high).to.be.eq(high)
    expect(ticker.low).to.be.eq(low)
    expect(ticker.bid).to.be.eq(bid)
    expect(ticker.ask).to.be.eq(ask)
    expect(ticker.last).to.be.eq(lastTradePrice)
    expect(ticker.change).to.be.eq(change)
    expect(ticker.baseVolume).to.be.eq(volume)
    expect(ticker.quoteVolume).to.be.eq(0)

    expect(market.spotEnabled).not.to.be.ok
    expect(market.marginEnabled).not.to.be.ok
    expect(market.derivativesEnabled).not.to.be.ok

  })

  it('should parse many Valr markets just fine', async () => {

    const parseMock = ImportMock.mockFunction(
      ValrMarketModule,
      'parse',
    )

    parseMock
      .onFirstCall()
      .returns({
        market: VALR_PARSED_MARKETS[0],
        requestCount: 1,
      })
      .onSecondCall()
      .returns({
        market: VALR_PARSED_MARKETS[1],
        requestCount: 1,
      })
      .onThirdCall()
      .returns({
        market: VALR_PARSED_MARKETS[2],
        requestCount: 1,
      })

    const { markets } = ValrMarketModule.parseMany({
      rawMarkets: VALR_RAW_MARKETS_WITH_CURRENCY,
    })

    markets.forEach((market, index) => {

      const {
        baseSymbolId,
        quoteSymbolId,
        symbolPair,
      } = VALR_PARSED_MARKETS[index]

      expect(market.exchangeId).to.be.eq(Valr.ID)
      expect(market.symbolPair).to.be.eq(symbolPair)
      expect(market.baseSymbolId).to.be.eq(baseSymbolId)
      expect(market.quoteSymbolId).to.be.eq(quoteSymbolId)

    })

  })

})
