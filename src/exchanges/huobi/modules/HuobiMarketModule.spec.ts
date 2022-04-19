import { expect } from 'chai'
import { ImportMock } from 'ts-mock-imports'

import { Huobi } from '../Huobi'
import { HuobiHttp } from '../HuobiHttp'
import { PROD_HUOBI_URL } from '../HuobiSpecs'
import { HuobiCurrencyMarketParser } from '../schemas/parsers/HuobiCurrencyMarketParser'
import { HuobiMarketParser } from '../schemas/parsers/HuobiMarketParser'
import {
  HUOBI_PARSED_MARKETS,
  HUOBI_RAW_MARKETS_WITH_CURRENCY,
} from '../test/fixtures/huobiMarket'
import { HuobiMarketModule } from './HuobiMarketModule'
import { HuobiSymbolModule } from './HuobiSymbolModule'



describe('HuobiMarketModule', () => {


  it('should list Huobi raw markets just fine', async () => {

    const rawMarkets = 'rawMarkets'
    const rawSymbolsPairs = 'rawSymbolsPairs'

    const marketsURL = `${PROD_HUOBI_URL}/market/tickers`

    const requestMock = ImportMock.mockFunction(
      HuobiHttp,
      'publicRequest',
    )

    const huobiSymbolModuleMock = ImportMock.mockFunction(
      HuobiSymbolModule,
      'listRaw',
    )

    huobiSymbolModuleMock
      .onFirstCall().returns(Promise.resolve({
        rawSymbols: rawSymbolsPairs,
        requestCount: 1,
      }))

    requestMock
      .onFirstCall().returns(Promise.resolve({
        data: rawMarkets,
        requestCount: 1,
      }))

    const currecyMarketParserMock = ImportMock.mockFunction(
      HuobiCurrencyMarketParser,
      'parse',
      HUOBI_RAW_MARKETS_WITH_CURRENCY,
    )


    const {
      rawMarkets: response,
      requestCount,
    } = await HuobiMarketModule.listRaw()

    expect(requestCount).to.be.eq(2)

    expect(requestMock.callCount).to.be.eq(1)
    expect(huobiSymbolModuleMock.callCount).to.be.eq(1)
    expect(requestMock.calledWith({ url: marketsURL })).to.be.ok
    expect(huobiSymbolModuleMock.calledWith()).to.be.ok

    expect(currecyMarketParserMock.callCount).to.be.eq(1)
    expect(currecyMarketParserMock.calledWith({
      rawMarkets,
      rawSymbols: rawSymbolsPairs,
    })).to.be.ok

    expect(response.length).to.eq(3)
    expect(response).to.deep.eq(HUOBI_RAW_MARKETS_WITH_CURRENCY)

  })



  it('should list Huobi parsed markets just fine', async () => {

    const rawListMock = 'rawListMock'

    const listRawMock = ImportMock.mockFunction(
      HuobiMarketModule,
      'listRaw',
      { rawMarkets: rawListMock, requestCount: 0 },
    )

    const parseManyMock = ImportMock.mockFunction(
      HuobiMarketModule,
      'parseMany',
      { markets: HUOBI_PARSED_MARKETS, requestCount: 0 },
    )

    const { markets: parsedMarkets } = await HuobiMarketModule.list()

    expect(listRawMock.callCount).to.eq(1)

    expect(parseManyMock.callCount).to.eq(1)
    expect(parseManyMock.calledWith({
      rawMarkets: rawListMock,
    }))

    expect(parsedMarkets.length).to.eq(3)
    expect(parsedMarkets).to.deep.eq(HUOBI_PARSED_MARKETS)

  })



  it('should parse a Huobi market just fine', async () => {

    const parsedMarketMock = HUOBI_PARSED_MARKETS[0]

    const marketParserMock = ImportMock.mockFunction(
      HuobiMarketParser,
      'parse',
      parsedMarketMock,
    )

    const rawMarketWithCurrency = HUOBI_RAW_MARKETS_WITH_CURRENCY[0]

    const { market } = HuobiMarketModule.parse({
      rawMarket: rawMarketWithCurrency,
    })

    expect(marketParserMock.callCount).to.be.eq(1)

    const { ticker } = market

    expect(market).to.deep.eq(parsedMarketMock)

    expect(market.exchangeId).to.be.eq(Huobi.ID)
    expect(market.symbolPair).to.be.eq(parsedMarketMock.symbolPair)
    expect(market.baseSymbolId).to.be.eq(parsedMarketMock.baseSymbolId)
    expect(market.quoteSymbolId).to.be.eq(parsedMarketMock.quoteSymbolId)


    const {
      high,
      low,
      bid,
      ask,
      close,
      open,
      vol: quoteVolume,
      amount: baseVolume,
    } = rawMarketWithCurrency

    const lastTradePrice = close
    const change = open - close

    expect(ticker).to.be.ok
    expect(ticker.high).to.be.eq(high)
    expect(ticker.low).to.be.eq(low)
    expect(ticker.bid).to.be.eq(bid)
    expect(ticker.ask).to.be.eq(ask)
    expect(ticker.last).to.be.eq(lastTradePrice)
    expect(ticker.change).to.be.eq(change)
    expect(ticker.baseVolume).to.be.eq(baseVolume)
    expect(ticker.quoteVolume).to.be.eq(quoteVolume)

    expect(market.spotEnabled).to.be.ok
    expect(market.marginEnabled).not.to.be.ok
    expect(market.derivativesEnabled).not.to.be.ok

  })



  it('should parse many Huobi markets just fine', async () => {

    const parseMock = ImportMock.mockFunction(
      HuobiMarketModule,
      'parse',
    )

    parseMock
      .onFirstCall()
      .returns({ market: HUOBI_PARSED_MARKETS[0], requestCount: 0 })
      .onSecondCall()
      .returns({ market: HUOBI_PARSED_MARKETS[1], requestCount: 0 })
      .onThirdCall()
      .returns({ market: HUOBI_PARSED_MARKETS[2], requestCount: 0 })

    const { markets } = HuobiMarketModule.parseMany({
      rawMarkets: HUOBI_RAW_MARKETS_WITH_CURRENCY,
    })

    markets.forEach((market, index) => {

      const {
        baseSymbolId,
        quoteSymbolId,
        symbolPair,
      } = HUOBI_PARSED_MARKETS[index]

      expect(market.exchangeId).to.be.eq(Huobi.ID)
      expect(market.symbolPair).to.be.eq(symbolPair)
      expect(market.baseSymbolId).to.be.eq(baseSymbolId)
      expect(market.quoteSymbolId).to.be.eq(quoteSymbolId)

    })

  })

})
