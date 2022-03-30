import { expect } from 'chai'
import { ImportMock } from 'ts-mock-imports'

import { Binance } from '../Binance'
import { BinanceHttp } from '../BinanceHttp'
import { PROD_BINANCE_URL } from '../BinanceSpecs'
import { BinanceCurrencyMarketParser } from '../schemas/parses/BinanceCurrencyMarketParser'
import { BinanceMarketParser } from '../schemas/parses/BinanceMarketParser'
import {
  BINANCE_PARSED_MARKET,
  BINANCE_RAW_MARKETS_WITH_CURRENCY,
} from '../test/fixtures/binanceMarket'
import { BinanceMarketModule } from './BinanceMarketModule'
import { BinanceSymbolModule } from './BinanceSymbolModule'



describe('BinanceMarketModule', () => {


  it('should list Binance raw markets just fine', async () => {

    const rawMarkets = 'rawMarkets'
    const rawSymbolsPairs = 'rawSymbolsPairs'

    const marketsURL = `${PROD_BINANCE_URL}/api/v3/ticker/24hr`

    const requestMock = ImportMock.mockFunction(
      BinanceHttp,
      'publicRequest',
    )

    const binanceSymbolModuleMock = ImportMock.mockFunction(
      BinanceSymbolModule,
      'listRaw',
    )

    binanceSymbolModuleMock
      .onFirstCall().returns(Promise.resolve({
        rawSymbols: rawSymbolsPairs,
        apiRequestCount: 1,
      }))

    requestMock
      .onFirstCall().returns(Promise.resolve({
        data: rawMarkets,
        apiRequestCount: 1,
      }))


    const currecyMarketParserMock = ImportMock.mockFunction(
      BinanceCurrencyMarketParser,
      'parse',
      BINANCE_RAW_MARKETS_WITH_CURRENCY,
    )


    const {
      rawMarkets: response,
      apiRequestCount,
    } = await BinanceMarketModule.listRaw()

    expect(apiRequestCount).to.be.eq(4)

    expect(requestMock.callCount).to.be.eq(1)
    expect(binanceSymbolModuleMock.callCount).to.be.eq(1)
    expect(requestMock.calledWith({ url: marketsURL })).to.be.ok
    expect(binanceSymbolModuleMock.calledWith()).to.be.ok

    expect(currecyMarketParserMock.callCount).to.be.eq(1)
    expect(currecyMarketParserMock.calledWith({
      rawMarkets,
      rawSymbols: rawSymbolsPairs,
    })).to.be.ok

    expect(response.length).to.eq(3)
    expect(response).to.deep.eq(BINANCE_RAW_MARKETS_WITH_CURRENCY)

  })



  it('should list Binance parsed markets just fine', async () => {

    const rawListMock = 'rawListMock'

    const listRawMock = ImportMock.mockFunction(
      BinanceMarketModule,
      'listRaw',
      { rawMarkets: rawListMock, apiRequestCount: 0 },
    )

    const parseManyMock = ImportMock.mockFunction(
      BinanceMarketModule,
      'parseMany',
      { markets: BINANCE_PARSED_MARKET, apiRequestCount: 0 },
    )

    const { markets: parsedMarkets } = await BinanceMarketModule.list()

    expect(listRawMock.callCount).to.eq(1)

    expect(parseManyMock.callCount).to.eq(1)
    expect(parseManyMock.calledWith({
      rawMarkets: rawListMock,
    }))

    expect(parsedMarkets.length).to.eq(3)
    expect(parsedMarkets).to.deep.eq(BINANCE_PARSED_MARKET)

  })



  it('should parse a Binance market just fine', async () => {

    const parsedMarketMock = BINANCE_PARSED_MARKET[0]

    const marketParserMock = ImportMock.mockFunction(
      BinanceMarketParser,
      'parse',
      parsedMarketMock,
    )

    const rawMarketWithCurrency = BINANCE_RAW_MARKETS_WITH_CURRENCY[0]

    const { market } = BinanceMarketModule.parse({
      rawMarket: rawMarketWithCurrency,
    })

    expect(marketParserMock.callCount).to.be.eq(1)

    const { ticker } = market

    expect(market).to.deep.eq(parsedMarketMock)

    expect(market.exchangeId).to.be.eq(Binance.ID)
    expect(market.symbolPair).to.be.eq(parsedMarketMock.symbolPair)
    expect(market.baseSymbolId).to.be.eq(parsedMarketMock.baseSymbolId)
    expect(market.quoteSymbolId).to.be.eq(parsedMarketMock.quoteSymbolId)


    const {
      highPrice,
      lowPrice,
      bidPrice,
      askPrice,
      lastPrice,
      priceChange,
      volume: baseVolume,
      quoteVolume,
    } = rawMarketWithCurrency

    const high = parseFloat(highPrice)
    const low = parseFloat(lowPrice)
    const bid = parseFloat(bidPrice)
    const ask = parseFloat(askPrice)
    const lastTradePrice = parseFloat(lastPrice)
    const change = parseFloat(priceChange) / 100
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
    expect(market.marginEnabled).to.be.ok
    expect(market.derivativesEnabled).not.to.be.ok

  })



  it('should parse many Binance markets just fine', async () => {

    const parseMock = ImportMock.mockFunction(
      BinanceMarketModule,
      'parse',
    )

    parseMock
      .onFirstCall()
      .returns({ market: BINANCE_PARSED_MARKET[0], apiRequestCount: 0 })
      .onSecondCall()
      .returns({ market: BINANCE_PARSED_MARKET[1], apiRequestCount: 0 })
      .onThirdCall()
      .returns({ market: BINANCE_PARSED_MARKET[2], apiRequestCount: 0 })

    const { markets } = BinanceMarketModule.parseMany({
      rawMarkets: BINANCE_RAW_MARKETS_WITH_CURRENCY,
    })

    markets.forEach((market, index) => {

      const {
        baseSymbolId,
        quoteSymbolId,
        symbolPair,
      } = BINANCE_PARSED_MARKET[index]

      expect(market.exchangeId).to.be.eq(Binance.ID)
      expect(market.symbolPair).to.be.eq(symbolPair)
      expect(market.baseSymbolId).to.be.eq(baseSymbolId)
      expect(market.quoteSymbolId).to.be.eq(quoteSymbolId)

    })

  })

})
