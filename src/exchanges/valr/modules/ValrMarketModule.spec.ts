import { expect } from 'chai'
import { ImportMock } from 'ts-mock-imports'

import { IAlunaMarketSchema } from '../../../lib/schemas/IAlunaMarketSchema'
import { ValrCurrencyPairsParser } from '../schemas/parsers/ValrCurrencyPairsParser'
import { ValrMarketParser } from '../schemas/parsers/ValrMarketParser'
import { VALR_SEEDS } from '../test/fixtures'
import { ValrHttp } from '../ValrHttp'
import { ValrMarketModule } from './ValrMarketModule'



describe('ValrMarketModule', () => {

  const valrMarketModule = ValrMarketModule

  const { marketsSeeds } = VALR_SEEDS



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
      .onFirstCall().returns(rawMarkets)
      .onSecondCall().returns(rawSymbolsPairs)


    const currencyPairsParseMock = ImportMock.mockFunction(
      ValrCurrencyPairsParser,
      'parse',
      marketsSeeds.rawMarketWithCurrency,
    )


    const response = await valrMarketModule.listRaw()


    expect(requestMock.callCount).to.be.eq(2)
    expect(requestMock.args[0]).to.deep.eq([{ url: marketsURL }])
    expect(requestMock.args[1]).to.deep.eq([{ url: symbolPairsURL }])

    expect(currencyPairsParseMock.callCount).to.be.eq(1)
    expect(currencyPairsParseMock.calledWith({
      rawMarkets,
      rawCurrencyPairs: rawSymbolsPairs,
    })).to.be.true

    expect(response.length).to.eq(3)
    expect(response).to.deep.eq(currencyPairsParseMock.returnValues[0])
    expect(response[0].currencyPair).to.eq('USDCETH')
    expect(response[1].currencyPair).to.eq('BTCZAR')
    expect(response[2].currencyPair).to.eq('ETHZAR')

  })



  it('should list Valr parsed markets just fine', async () => {

    const listRawMock = ImportMock.mockFunction(
      valrMarketModule,
      'listRaw',
    )

    const parseManyMock = ImportMock.mockFunction(
      valrMarketModule,
      'parseMany',
      marketsSeeds.parsedMarkets,
    )

    const parsedMarkets = await valrMarketModule.list()

    expect(listRawMock.callCount).to.eq(1)

    expect(parseManyMock.callCount).to.eq(1)
    expect(parseManyMock.calledWith({
      rawMarkets: listRawMock.returnValues[0],
    }))

    expect(parsedMarkets.length).to.eq(3)
    expect(parsedMarkets).to.deep.eq(parseManyMock.returnValues[0])

    expect(parsedMarkets[0].pairSymbol).to.eq('USDCETH')
    expect(parsedMarkets[0].baseSymbolId).to.eq('USDC')
    expect(parsedMarkets[0].quoteSymbolId).to.eq('ETH')

    expect(parsedMarkets[1].pairSymbol).to.eq('BTCZAR')
    expect(parsedMarkets[1].baseSymbolId).to.eq('BTC')
    expect(parsedMarkets[1].quoteSymbolId).to.eq('ZAR')

    expect(parsedMarkets[2].pairSymbol).to.eq('ETHZAR')
    expect(parsedMarkets[2].baseSymbolId).to.eq('ETH')
    expect(parsedMarkets[2].quoteSymbolId).to.eq('ZAR')

  })



  it('should parse a Valr market just fine', async () => {

    const marketParserMock = ImportMock.mockFunction(
      ValrMarketParser,
      'parse',
      marketsSeeds.parsedMarkets[0],
    )

    const market: IAlunaMarketSchema = valrMarketModule.parse({
      rawMarket: marketsSeeds.rawMarketWithCurrency[0],
    })

    expect(marketParserMock.callCount).to.be.eq(1)

    const { ticker } = market

    expect(market).to.deep.eq(marketParserMock.returnValues[0])
    expect(market.pairSymbol).to.be.eq('USDCETH')
    expect(market.baseSymbolId).to.be.eq('USDC')
    expect(market.quoteSymbolId).to.be.eq('ETH')

    expect(ticker).to.be.ok
    expect(ticker.high).to.be.eq(0.00043926)
    expect(ticker.low).to.be.eq(0.00038734)
    expect(ticker.bid).to.be.eq(0.00039291)
    expect(ticker.ask).to.be.eq(0.00039334)
    expect(ticker.last).to.be.eq(0.00039266)
    expect(ticker.change).to.be.eq(-0.0616)
    expect(ticker.baseVolume).to.be.eq(0)
    expect(ticker.quoteVolume).to.be.eq(0)

    expect(market.spotEnabled).to.be.false
    expect(market.marginEnabled).to.be.false
    expect(market.derivativesEnabled).to.be.false

  })



  it('should parse many Valr markets just fine', async () => {

    const parseMock = ImportMock.mockFunction(
      valrMarketModule,
      'parse',
    )

    parseMock
      .onFirstCall()
      .returns(marketsSeeds.parsedMarkets[0])
      .onSecondCall()
      .returns(marketsSeeds.parsedMarkets[1])
      .onThirdCall()
      .returns(marketsSeeds.parsedMarkets[2])


    const markets: IAlunaMarketSchema[] = valrMarketModule.parseMany({
      rawMarkets: marketsSeeds.rawMarketWithCurrency,
    })


    expect(markets[0].pairSymbol).to.be.eq('USDCETH')
    expect(markets[1].pairSymbol).to.be.eq('BTCZAR')
    expect(markets[2].pairSymbol).to.be.eq('ETHZAR')

  })

})
