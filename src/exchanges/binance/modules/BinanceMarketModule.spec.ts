import { expect } from 'chai'
import { ImportMock } from 'ts-mock-imports'

import { IAlunaMarketSchema } from '../../../lib/schemas/IAlunaMarketSchema'
import {
  Binance,
  PROD_BINANCE_URL,
} from '../Binance'
import { BinanceHttp } from '../BinanceHttp'
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

    const marketsURL = PROD_BINANCE_URL + '/api/v3/ticker/24hr'

    const requestMock = ImportMock.mockFunction(
      BinanceHttp,
      'publicRequest',
    )
    
    const binanceSymbolModuleMock = ImportMock.mockFunction(
      BinanceSymbolModule,
      'listRaw',
    )

    binanceSymbolModuleMock
      .onFirstCall().returns(Promise.resolve(rawSymbolsPairs))

    requestMock
      .onFirstCall().returns(Promise.resolve(rawMarkets))


    const currecyMarketParserMock = ImportMock.mockFunction(
      BinanceCurrencyMarketParser,
      'parse',
      BINANCE_RAW_MARKETS_WITH_CURRENCY,
    )


    const response = await BinanceMarketModule.listRaw()


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

    response.forEach((res, index) => {

      const {
        symbol,
        askPrice,
        bidPrice,
        lastPrice,
        prevClosePrice,
        volume,
        highPrice,
        lowPrice,
        priceChange,
        baseCurrency,
        quoteCurrency,
      } = BINANCE_RAW_MARKETS_WITH_CURRENCY[index]

      expect(res.symbol).to.be.eq(symbol)
      expect(res.askPrice).to.be.eq(askPrice)
      expect(res.bidPrice).to.be.eq(bidPrice)
      expect(res.lastPrice).to.be.eq(lastPrice)
      expect(res.prevClosePrice).to.be.eq(prevClosePrice)
      expect(res.volume).to.be.eq(volume)
      expect(res.highPrice).to.be.eq(highPrice)
      expect(res.lowPrice).to.be.eq(lowPrice)
      expect(res.priceChange).to.be.eq(priceChange)
      expect(res.baseCurrency).to.be.eq(baseCurrency)
      expect(res.quoteCurrency).to.be.eq(quoteCurrency)

    })

  })



  it('should list Binance parsed markets just fine', async () => {

    const rawListMock = 'rawListMock'

    const listRawMock = ImportMock.mockFunction(
      BinanceMarketModule,
      'listRaw',
      rawListMock,
    )

    const parseManyMock = ImportMock.mockFunction(
      BinanceMarketModule,
      'parseMany',
      BINANCE_PARSED_MARKET,
    )

    const parsedMarkets = await BinanceMarketModule.list()

    expect(listRawMock.callCount).to.eq(1)

    expect(parseManyMock.callCount).to.eq(1)
    expect(parseManyMock.calledWith({
      rawMarkets: rawListMock,
    }))

    expect(parsedMarkets.length).to.eq(3)
    expect(parsedMarkets).to.deep.eq(BINANCE_PARSED_MARKET)

    parsedMarkets.forEach((parsed, index) => {

      const {
        pairSymbol,
        baseSymbolId,
        quoteSymbolId,
      } = BINANCE_PARSED_MARKET[index]

      expect(parsed.exchangeId).to.eq(Binance.ID)
      expect(parsed.pairSymbol).to.be.eq(pairSymbol)
      expect(parsed.baseSymbolId).to.be.eq(baseSymbolId)
      expect(parsed.quoteSymbolId).to.be.eq(quoteSymbolId)

    })

  })



  it('should parse a Binance market just fine', async () => {

    const parsedMarketMock = BINANCE_PARSED_MARKET[0]

    const marketParserMock = ImportMock.mockFunction(
      BinanceMarketParser,
      'parse',
      parsedMarketMock,
    )

    const rawMarketWithCurrency = BINANCE_RAW_MARKETS_WITH_CURRENCY[0]

    const market: IAlunaMarketSchema = BinanceMarketModule.parse({
      rawMarket: rawMarketWithCurrency,
    })

    expect(marketParserMock.callCount).to.be.eq(1)

    const { ticker } = market

    expect(market).to.deep.eq(parsedMarketMock)

    expect(market.exchangeId).to.be.eq(Binance.ID)
    expect(market.pairSymbol).to.be.eq(parsedMarketMock.pairSymbol)
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
      quoteVolume
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
    expect(ticker.quoteVolume).to.be.eq(Number(quoteVolume))

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
      .returns(BINANCE_PARSED_MARKET[0])
      .onSecondCall()
      .returns(BINANCE_PARSED_MARKET[1])
      .onThirdCall()
      .returns(BINANCE_PARSED_MARKET[2])


    const markets: IAlunaMarketSchema[] = BinanceMarketModule.parseMany({
      rawMarkets: BINANCE_RAW_MARKETS_WITH_CURRENCY,
    })

    markets.forEach((market, index) => {

      const {
        baseSymbolId,
        quoteSymbolId,
        pairSymbol,
      } = BINANCE_PARSED_MARKET[index]

      expect(market.exchangeId).to.be.eq(Binance.ID)
      expect(market.pairSymbol).to.be.eq(pairSymbol)
      expect(market.baseSymbolId).to.be.eq(baseSymbolId)
      expect(market.quoteSymbolId).to.be.eq(quoteSymbolId)

    })

  })

})
