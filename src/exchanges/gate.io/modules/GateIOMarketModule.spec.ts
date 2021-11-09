import { expect } from 'chai'
import { ImportMock } from 'ts-mock-imports'

import { GateIOHttp } from '../GateIOHttp'
import { GateIOMarketParser } from '../schemas/parsers/GateIOMarketParser'
import { GateIO_SEEDS } from '../test/fixtures/index'
import { GateIOMarketModule } from './GateIOMarketModule'



describe('GateIOMarketModule', () => {


  const gateIOMarketModule = GateIOMarketModule

  const { marketsSeeds } = GateIO_SEEDS


  it('should list GateIO raw markets just fine', async () => {


    const { rawMarkets } = marketsSeeds
    const rawSymbolsPairs = 'rawSymbolsPairs'

    const marketsURL = 'https://api.GateIO.ws/api/v4/spot/'
    const symbolPairsURL = 'https://api.GateIO.ws/api/v4/spot/'

    const requestMock = ImportMock.mockFunction(
      GateIOHttp,
      'publicRequest',
    )

    requestMock
      .onFirstCall().returns(rawMarkets)
      .onSecondCall().returns(rawSymbolsPairs)

    const currencyPairsParseMock = ImportMock.mockFunction(
      GateIOMarketParser,
      'parse',
      marketsSeeds.rawMarkets,
    )


    const response = await gateIOMarketModule.listRaw()


    expect(requestMock.callCount).to.be.eq(2)
    expect(requestMock.args[0]).to.deep.eq([{ url: marketsURL }])
    expect(requestMock.args[1]).to.deep.eq([{ url: symbolPairsURL }])

    expect(currencyPairsParseMock.callCount).to.be.eq(1)
    expect(currencyPairsParseMock.calledWith({
      rawMarkets,
      rawCurrencyPairs: rawSymbolsPairs,
    })).to.be.ok

    expect(response.length).to.eq(3)
    expect(response).to.deep.eq(currencyPairsParseMock.returnValues[0])
    expect(response[0].currencyPair).to.eq('IHTETH')
    expect(response[1].currencyPair).to.eq('AMEETH')
    expect(response[2].currencyPair).to.eq('ALEPHUSDT')


  })



  it.skip('should list GateIO parsed markets just fine', async () => {

    // TODO implement me

  })



  it.skip('should parse a GateIO market just fine', async () => {

    // TODO implement me

  })



  it.skip('should parse many GateIO markets just fine', async () => {

    // TODO implement me

  })

})
