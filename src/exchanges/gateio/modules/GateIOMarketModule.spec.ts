import { expect } from 'chai'
import { ImportMock } from 'ts-mock-imports'

import { IAlunaMarketSchema } from '../../../lib/schemas/IAlunaMarketSchema'
import { GateIOHttp } from '../GateIOHttp'
import { GateIOMarketParser } from '../schemas/parsers/GateIOMarketParser'
import { GATEIO_SEEDS } from '../test/fixtures'
import { GateIOMarketModule } from './GateIOMarketModule'



describe('GateIOMarketModule', () => {


  const gateIOMarketModule = GateIOMarketModule

  const { marketsSeeds } = GATEIO_SEEDS


  it('should list GateIO raw markets just fine', async () => {


    const {
      rawMarkets, rawTickers,
    } = marketsSeeds

    const currencyPairsURL = 'https://api.gateio.ws/api/v4/spot/currency_pairs'
    const tickersURL = 'https://api.gateio.ws/api/v4/spot/tickers'

    const requestMock = ImportMock.mockFunction(
      GateIOHttp,
      'publicRequest',
    )

    requestMock
      .onFirstCall().returns(rawMarkets)
      .onSecondCall().returns(rawTickers)

    const response = await gateIOMarketModule.listRaw()


    expect(requestMock.callCount).to.be.eq(2)
    expect(requestMock.args[0]).to.deep.eq([{ url: currencyPairsURL }])
    expect(requestMock.args[1]).to.deep.eq([{ url: tickersURL }])


    expect(response.length).to.eq(3)

    expect(response[0].id).to.eq('IHT_ETH')
    expect(response[1].id).to.eq('AME_ETH')
    expect(response[2].id).to.eq('ALEPH_USDT')

  })



  it('should list GateIO parsed markets just fine', async () => {

    const listRawMock = ImportMock.mockFunction(
      gateIOMarketModule,
      'listRaw',
    )

    const parseManyMock = ImportMock.mockFunction(
      gateIOMarketModule,
      'parseMany',
      marketsSeeds.parsedMarkets,
    )

    const parsedMarkets = await gateIOMarketModule.list()

    expect(listRawMock.callCount).to.eq(1)

    expect(parseManyMock.callCount).to.eq(1)
    expect(parseManyMock.calledWith({
      rawMarkets: listRawMock.returnValues[0],
    }))

    expect(parsedMarkets.length).to.eq(3)
    expect(parsedMarkets).to.deep.eq(parseManyMock.returnValues[0])

    expect(parsedMarkets[0].pairSymbol).to.eq('IHTETH')
    expect(parsedMarkets[0].baseSymbolId).to.eq('IHT')
    expect(parsedMarkets[0].quoteSymbolId).to.eq('ETH')

    expect(parsedMarkets[1].pairSymbol).to.eq('AMEETH')
    expect(parsedMarkets[1].baseSymbolId).to.eq('AME')
    expect(parsedMarkets[1].quoteSymbolId).to.eq('ETH')

    expect(parsedMarkets[2].pairSymbol).to.eq('ALEPHUSDT')
    expect(parsedMarkets[2].baseSymbolId).to.eq('ALEPH')
    expect(parsedMarkets[2].quoteSymbolId).to.eq('USDT')

  })



  it('should parse a GateIO market just fine', async () => {

    const marketParserMock = ImportMock.mockFunction(
      GateIOMarketParser,
      'parse',
      marketsSeeds.parsedMarkets[0],
    )

    const market: IAlunaMarketSchema = gateIOMarketModule.parse({
      rawMarket: marketsSeeds.rawMarkets[0],
    })


    expect(marketParserMock.callCount).to.be.eq(1)

    const rawTicker = marketsSeeds.rawTickers[0]
    const { ticker } = market

    expect(market).to.deep.eq(marketParserMock.returnValues[0])
    expect(market.pairSymbol).to.be.eq('IHTETH')
    expect(market.baseSymbolId).to.be.eq('IHT')
    expect(market.quoteSymbolId).to.be.eq('ETH')



    expect(ticker).to.be.ok
    expect(ticker.high).to.be.eq(parseFloat(rawTicker.high_24h))
    expect(ticker.low).to.be.eq(parseFloat(rawTicker.low_24h))
    expect(ticker.bid).to.be.eq(parseFloat(rawTicker.highest_bid))
    expect(ticker.ask).to.be.eq(parseFloat(rawTicker.lowest_ask))
    expect(ticker.last).to.be.eq(parseFloat(rawTicker.last))
    expect(ticker.change).to.be.eq(parseFloat(rawTicker.change_percentage))
    expect(ticker.baseVolume).to.be.eq(parseFloat(rawTicker.base_volume))
    expect(ticker.quoteVolume).to.be.eq(parseFloat(rawTicker.quote_volume))

    expect(market.spotEnabled).not.to.be.ok
    expect(market.marginEnabled).not.to.be.ok
    expect(market.derivativesEnabled).not.to.be.ok

  })



  it('should parse many GateIO markets just fine', async () => {

    const { rawMarkets } = marketsSeeds

    const markets: IAlunaMarketSchema[] = gateIOMarketModule.parseMany({
      rawMarkets,
    })

    expect(markets[0].pairSymbol)
      .to.be.eq(`${rawMarkets[0].base}${rawMarkets[0].quote}`)

    expect(markets[1].pairSymbol)
      .to.be.eq(`${rawMarkets[1].base}${rawMarkets[1].quote}`)

    expect(markets[2].pairSymbol)
      .to.be.eq(`${rawMarkets[2].base}${rawMarkets[2].quote}`)

  })

})
