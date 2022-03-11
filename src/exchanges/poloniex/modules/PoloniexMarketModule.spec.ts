import { expect } from 'chai'
import { each } from 'lodash'
import { ImportMock } from 'ts-mock-imports'

import { IAlunaMarketSchema } from '../../../lib/schemas/IAlunaMarketSchema'
import { Poloniex } from '../Poloniex'
import { PoloniexHttp } from '../PoloniexHttp'
import { PROD_POLONIEX_URL } from '../PoloniexSpecs'
import { PoloniexMarketParser } from '../schemas/parsers/PoloniexMarketParser'
import {
  POLONIEX_PARSED_MARKETS,
  POLONIEX_RAW_MARKET,
  POLONIEX_RAW_MARKETS_WITH_CURRENCY,
} from '../test/fixtures/poloniexMarket'
import { PoloniexMarketModule } from './PoloniexMarketModule'



describe('PoloniexMarketModule', () => {


  it('should list Poloniex raw markets just fine', async () => {

    const marketSummariesURL = `${PROD_POLONIEX_URL}/public?command=returnTicker`

    const requestMock = ImportMock.mockFunction(
      PoloniexHttp,
      'publicRequest',
      Promise.resolve(POLONIEX_RAW_MARKET),
    )

    const response = await PoloniexMarketModule.listRaw()

    expect(requestMock.callCount).to.be.eq(1)
    expect(requestMock.calledWith(
      { url: marketSummariesURL },
    )).to.be.ok

    expect(response).to.deep.eq(POLONIEX_RAW_MARKET)

  })

  it('should list Poloniex parsed markets just fine', async () => {

    const rawListMock = 'rawListMock'

    const listRawMock = ImportMock.mockFunction(
      PoloniexMarketModule,
      'listRaw',
      rawListMock,
    )

    const parseManyMock = ImportMock.mockFunction(
      PoloniexMarketModule,
      'parseMany',
      POLONIEX_PARSED_MARKETS,
    )

    const parsedMarkets = await PoloniexMarketModule.list()

    expect(listRawMock.callCount).to.eq(1)

    expect(parseManyMock.callCount).to.eq(1)
    expect(parseManyMock.calledWith({
      rawMarkets: rawListMock,
    }))

    expect(parsedMarkets.length).to.eq(3)
    expect(parsedMarkets).to.deep.eq(POLONIEX_PARSED_MARKETS)

  })

  it('should parse a Poloniex market just fine', async () => {

    const parsedMarketMock = POLONIEX_PARSED_MARKETS[0]

    const marketParserMock = ImportMock.mockFunction(
      PoloniexMarketParser,
      'parse',
      parsedMarketMock,
    )

    const rawMarketWithTicker = POLONIEX_RAW_MARKETS_WITH_CURRENCY[0]

    const market: IAlunaMarketSchema = PoloniexMarketModule.parse({
      rawMarket: rawMarketWithTicker,
    })

    expect(marketParserMock.callCount).to.be.eq(1)

    const { ticker } = market

    expect(market).to.deep.eq(parsedMarketMock)

    expect(market.exchangeId).to.be.eq(Poloniex.ID)
    expect(market.symbolPair).to.be.eq(parsedMarketMock.symbolPair)
    expect(market.baseSymbolId).to.be.eq(parsedMarketMock.baseSymbolId)
    expect(market.quoteSymbolId).to.be.eq(parsedMarketMock.quoteSymbolId)


    const {
      baseVolume,
      high24hr,
      highestBid,
      last,
      low24hr,
      lowestAsk,
      percentChange,
      quoteVolume,
    } = rawMarketWithTicker

    const high = parseFloat(high24hr)
    const low = parseFloat(low24hr)
    const bid = parseFloat(highestBid)
    const ask = parseFloat(lowestAsk)
    const lastTradePrice = parseFloat(last)
    const change = parseFloat(percentChange)
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

  it('should parse many Poloniex markets just fine', async () => {

    const parseMock = ImportMock.mockFunction(
      PoloniexMarketModule,
      'parse',
    )

    parseMock
      .onFirstCall()
      .returns(POLONIEX_PARSED_MARKETS[0])
      .onSecondCall()
      .returns(POLONIEX_PARSED_MARKETS[1])
      .onThirdCall()
      .returns(POLONIEX_PARSED_MARKETS[2])


    const markets = PoloniexMarketModule.parseMany({
      rawMarkets: POLONIEX_RAW_MARKET,
    })

    expect(markets).to.deep.eq(POLONIEX_PARSED_MARKETS)

    each(markets, (market, index) => {

      const rawMarket = POLONIEX_RAW_MARKET[market.symbolPair]

      const [quoteCurrency, baseCurrency] = market.symbolPair.split('_')

      expect(parseMock.args[index][0]).to.deep.eq({
        rawMarket: {
          currencyPair: market.symbolPair,
          quoteCurrency,
          baseCurrency,
          ...rawMarket,
        },
      })

    })

  })

})
