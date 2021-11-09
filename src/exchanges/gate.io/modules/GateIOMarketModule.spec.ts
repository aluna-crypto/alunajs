import { expect } from 'chai'
import { ImportMock } from 'ts-mock-imports'

import { GateIOHttp } from '../GateIOHttp'
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



  it.skip('should parse a GateIO market just fine', async () => {

    // TODO implement me

  })



  it.skip('should parse many GateIO markets just fine', async () => {

    // TODO implement me

  })

})
