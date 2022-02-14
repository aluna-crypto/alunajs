import { expect } from 'chai'
import { ImportMock } from 'ts-mock-imports'

import { IAlunaMarketSchema } from '../../../lib/schemas/IAlunaMarketSchema'
import { Gateio } from '../Gateio'
import { GateioHttp } from '../GateioHttp'
import { PROD_GATEIO_URL } from '../GateioSpecs'
import { GateioCurrencyMarketParser } from '../schemas/parsers/GateioCurrencyMarketParser'
import { GateioMarketParser } from '../schemas/parsers/GateioMarketParser'
import {
  GATEIO_PARSED_MARKETS,
  GATEIO_RAW_MARKETS_WITH_CURRENCY,
} from '../test/fixtures/gateioMarket'
import { GateioMarketModule } from './GateioMarketModule'



describe('GateioMarketModule', () => {


  it('should list Gateio raw markets just fine', async () => {

    const rawMarkets = 'rawMarkets'

    const marketsURL = `${PROD_GATEIO_URL}/spot/tickers`

    const requestMock = ImportMock.mockFunction(
      GateioHttp,
      'publicRequest',
    )

    requestMock
      .onFirstCall().returns(Promise.resolve(rawMarkets))

    const currecyMarketParserMock = ImportMock.mockFunction(
      GateioCurrencyMarketParser,
      'parse',
      GATEIO_RAW_MARKETS_WITH_CURRENCY,
    )


    const response = await GateioMarketModule.listRaw()


    expect(requestMock.callCount).to.be.eq(1)
    expect(requestMock.firstCall.calledWith({ url: marketsURL })).to.be.ok

    expect(currecyMarketParserMock.callCount).to.be.eq(1)
    expect(currecyMarketParserMock.calledWith({
      rawMarkets,
    })).to.be.ok

    expect(response.length).to.eq(4)
    expect(response).to.deep.eq(GATEIO_RAW_MARKETS_WITH_CURRENCY)

  })



  it('should list Gateio parsed markets just fine', async () => {

    const rawListMock = 'rawListMock'

    const listRawMock = ImportMock.mockFunction(
      GateioMarketModule,
      'listRaw',
      rawListMock,
    )

    const parseManyMock = ImportMock.mockFunction(
      GateioMarketModule,
      'parseMany',
      GATEIO_PARSED_MARKETS,
    )

    const parsedMarkets = await GateioMarketModule.list()

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

    const rawMarketWithCurrency = GATEIO_RAW_MARKETS_WITH_CURRENCY[0]

    const market: IAlunaMarketSchema = GateioMarketModule.parse({
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
      .returns(GATEIO_PARSED_MARKETS[0])
      .onSecondCall()
      .returns(GATEIO_PARSED_MARKETS[1])
      .onThirdCall()
      .returns(GATEIO_PARSED_MARKETS[2])


    const markets: IAlunaMarketSchema[] = GateioMarketModule.parseMany({
      rawMarkets: GATEIO_RAW_MARKETS_WITH_CURRENCY,
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
