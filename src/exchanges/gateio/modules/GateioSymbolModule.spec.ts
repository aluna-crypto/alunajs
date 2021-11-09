import { expect } from 'chai'
import { ImportMock } from 'ts-mock-imports'

import { GateioHttp } from '../GateioHttp'
import { IGateioSymbolSchema } from '../schemas/IGateioSymbolSchema'
import { GATEIO_SEEDS } from '../test/fixtures/index'
import { GateioSymbolModule } from './GateioSymbolModule'



describe('GateioSymbolModule', () => {

  const { symbolsSeeds } = GATEIO_SEEDS

  it('should list Gateio raw symbols just fine', async () => {

    const requestMock = ImportMock.mockFunction(
      GateioHttp,
      'publicRequest',
      symbolsSeeds.rawSymbols,
    )

    const rawSymbols = await GateioSymbolModule.listRaw()

    expect(requestMock.callCount).to.eq(1)

    expect(rawSymbols.length).to.eq(3)
    expect(rawSymbols).to.deep.eq(requestMock.returnValues[0])

    expect(rawSymbols[0].currency).to.be.eq('ETH')
    expect(rawSymbols[1].currency).to.be.eq('BTC')
    expect(rawSymbols[2].currency).to.be.eq('ADA')

  })



  it('should list Gateio parsed symbols just fine', async () => {

    const listRawMock = ImportMock.mockFunction(
      GateioSymbolModule,
      'listRaw',
      'raw-symbols',
    )

    const parseManyMock = ImportMock.mockFunction(
      GateioSymbolModule,
      'parseMany',
      symbolsSeeds.parsedSymbols,
    )

    const rawSymbols = await GateioSymbolModule.list()

    expect(listRawMock.callCount).to.eq(1)

    expect(parseManyMock.callCount).to.eq(1)
    expect(parseManyMock.calledWith({
      rawSymbols: listRawMock.returnValues[0],
    })).to.be.ok

    expect(rawSymbols.length).to.eq(3)
    expect(rawSymbols).to.deep.eq(parseManyMock.returnValues[0])

    expect(rawSymbols[0].id).to.be.eq('ETH')
    expect(rawSymbols[1].id).to.be.eq('BTC')
    expect(rawSymbols[2].id).to.be.eq('ADA')

  })



  it('should parse a Gateio symbol just fine', async () => {

    const parsedSymbol1 = GateioSymbolModule.parse({
      rawSymbol: symbolsSeeds.rawSymbols[1],
    })

    expect(parsedSymbol1).to.be.ok
    expect(parsedSymbol1.id).to.be.eq('BTC')

    const parsedSymbol2 = GateioSymbolModule.parse({
      rawSymbol: symbolsSeeds.rawSymbols[2],
    })

    expect(parsedSymbol2).to.be.ok
    expect(parsedSymbol2.id).to.be.eq('ADA')


  })



  it('should parse many Gateio symbols just fine', async () => {

    const parseMock = ImportMock.mockFunction(
      GateioSymbolModule,
      'parse',
    )

    parseMock
      .onFirstCall()
      .returns(symbolsSeeds.parsedSymbols[0])
      .onSecondCall()
      .returns(symbolsSeeds.parsedSymbols[1])
      .onThirdCall()
      .returns(symbolsSeeds.parsedSymbols[2])

    const parsedSymbols = GateioSymbolModule.parseMany({
      rawSymbols: new Array(3).fill(() => ({}) as IGateioSymbolSchema),
    })

    expect(parsedSymbols[0].id).to.be.eq('ETH')
    expect(parsedSymbols[1].id).to.be.eq('BTC')
    expect(parsedSymbols[2].id).to.be.eq('ADA')

  })

})
