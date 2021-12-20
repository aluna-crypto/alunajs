import { expect } from 'chai'
import { ImportMock } from 'ts-mock-imports'

import { IAlunaMarketSchema } from '../../../lib/schemas/IAlunaMarketSchema'
import { ValrCurrencyPairsParser } from '../schemas/parsers/ValrCurrencyPairsParser'
import { ValrMarketParser } from '../schemas/parsers/ValrMarketParser'
import {
  VALR_PARSED_MARKETS,
  VALR_RAW_MARKETS_WITH_CURRENCY,
} from '../test/fixtures/valrMarket'
import { Valr } from '../Valr'
import { ValrHttp } from '../ValrHttp'
import { ValrMarketModule } from './ValrMarketModule'



describe('ValrMarketModule', () => {

  it('should list Valr raw markets just fine', async () => {

    const rawMarkets = 'rawMarkets'
    const rawSymbolsPairs = 'rawSymbolsPairs'

    const marketsURL = 'https://api.valr.com/v1/public/marketsummary'
    const symbolPairsURL = 'https://api.valr.com/v1/public/pairs'

    const requestMock = ImportMock.mockFunction(
      ValrHttp,
      'publicRequest',
    )

    requestMock
      .onFirstCall().returns(Promise.resolve(rawMarkets))
      .onSecondCall().returns(Promise.resolve(rawSymbolsPairs))

    const currencyPairsParseMock = ImportMock.mockFunction(
      ValrCurrencyPairsParser,
      'parse',
      VALR_RAW_MARKETS_WITH_CURRENCY,
    )

    const response = await ValrMarketModule.listRaw()

    expect(requestMock.callCount).to.be.eq(2)
    expect(requestMock.calledWith({ url: marketsURL })).to.be.ok
    expect(requestMock.calledWith({ url: symbolPairsURL })).to.be.ok

    expect(currencyPairsParseMock.callCount).to.be.eq(1)
    expect(currencyPairsParseMock.calledWith({
      rawMarkets,
      rawCurrencyPairs: rawSymbolsPairs,
    })).to.be.ok

    expect(response.length).to.eq(3)
    expect(response).to.deep.eq(VALR_RAW_MARKETS_WITH_CURRENCY)

    response.forEach((res, index) => {

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

  it('should list Valr parsed markets just fine', async () => {

    const rawListMock = 'rawListMock'

    const listRawMock = ImportMock.mockFunction(
      ValrMarketModule,
      'listRaw',
      rawListMock,
    )

    const parseManyMock = ImportMock.mockFunction(
      ValrMarketModule,
      'parseMany',
      VALR_PARSED_MARKETS,
    )

    const parsedMarkets = await ValrMarketModule.list()

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

    const market: IAlunaMarketSchema = ValrMarketModule.parse({
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
      .returns(VALR_PARSED_MARKETS[0])
      .onSecondCall()
      .returns(VALR_PARSED_MARKETS[1])
      .onThirdCall()
      .returns(VALR_PARSED_MARKETS[2])

    const markets: IAlunaMarketSchema[] = ValrMarketModule.parseMany({
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
