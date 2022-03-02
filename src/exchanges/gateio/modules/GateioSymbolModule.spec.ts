import { expect } from 'chai'
import { ImportMock } from 'ts-mock-imports'

import { mockAlunaSymbolMapping } from '../../../utils/mappings/AlunaSymbolMapping.mock'
import { Gateio } from '../Gateio'
import { GateioHttp } from '../GateioHttp'
import {
  GATEIO_PARSED_SYMBOLS,
  GATEIO_RAW_SYMBOLS,
} from '../test/fixtures/gateioSymbol'
import { GateioSymbolModule } from './GateioSymbolModule'



describe('GateioSymbolModule', () => {


  it('should list Gateio raw symbols just fine', async () => {

    const requestMock = ImportMock.mockFunction(
      GateioHttp,
      'publicRequest',
      Promise.resolve(GATEIO_RAW_SYMBOLS),
    )

    const rawSymbols = await GateioSymbolModule.listRaw()

    expect(rawSymbols.length).to.eq(4)
    expect(rawSymbols).to.deep.eq(GATEIO_RAW_SYMBOLS)

    for (let index = 0; index < 4; index += 1) {

      expect(rawSymbols[index].withdraw_delayed)
        .to.be.eq(GATEIO_RAW_SYMBOLS[index].withdraw_delayed)
      expect(rawSymbols[index].withdraw_disabled)
        .to.be.eq(GATEIO_RAW_SYMBOLS[index].withdraw_disabled)
      expect(rawSymbols[index].trade_disabled)
        .to.be.eq(GATEIO_RAW_SYMBOLS[index].trade_disabled)
      expect(rawSymbols[index].deposit_disabled)
        .to.be.eq(GATEIO_RAW_SYMBOLS[index].deposit_disabled)
      expect(rawSymbols[index].delisted)
        .to.be.eq(GATEIO_RAW_SYMBOLS[index].delisted)
      expect(rawSymbols[index].currency)
        .to.be.eq(GATEIO_RAW_SYMBOLS[index].currency)

    }

    expect(requestMock.callCount).to.be.eq(1)

  })



  it('should list Gateio parsed symbols just fine', async () => {

    const listRawMock = ImportMock.mockFunction(
      GateioSymbolModule,
      'listRaw',
      Promise.resolve(GATEIO_RAW_SYMBOLS),
    )

    const parseManyMock = ImportMock.mockFunction(
      GateioSymbolModule,
      'parseMany',
      GATEIO_PARSED_SYMBOLS,
    )


    const rawSymbols = await GateioSymbolModule.list()

    expect(rawSymbols.length).to.eq(4)
    expect(rawSymbols).to.deep.eq(GATEIO_PARSED_SYMBOLS)

    for (let index = 0; index < 4; index += 1) {

      expect(rawSymbols[index].exchangeId).to.be.eq(Gateio.ID)
      expect(rawSymbols[index].id).to.be.eq(GATEIO_PARSED_SYMBOLS[index].id)

    }

    expect(listRawMock.callCount).to.eq(1)

    expect(parseManyMock.callCount).to.eq(1)
    expect(parseManyMock.calledWith({
      rawSymbols: GATEIO_RAW_SYMBOLS,
    })).to.be.ok

  })



  it('should parse a Gateio symbol just fine', async () => {

    const translateSymbolId = 'BTC'

    const { alunaSymbolMappingMock } = mockAlunaSymbolMapping()

    alunaSymbolMappingMock.returns(translateSymbolId)

    const rawSymbol1 = GATEIO_RAW_SYMBOLS[1]
    const rawSymbol2 = GATEIO_RAW_SYMBOLS[2]

    const parsedSymbol1 = GateioSymbolModule.parse({
      rawSymbol: rawSymbol1,
    })

    expect(parsedSymbol1.exchangeId).to.be.eq(Gateio.ID)
    expect(parsedSymbol1.id).to.be.eq(translateSymbolId)
    expect(parsedSymbol1.alias).to.be.eq(rawSymbol1.currency)


    alunaSymbolMappingMock.returns(rawSymbol2.currency)

    const parsedSymbol2 = GateioSymbolModule.parse({
      rawSymbol: rawSymbol2,
    })

    expect(parsedSymbol2.exchangeId).to.be.eq(Gateio.ID)
    expect(parsedSymbol2.id).to.be.eq(rawSymbol2.currency)
    expect(parsedSymbol2.alias).not.to.be.ok

  })



  it('should parse many Gateio symbols just fine', async () => {

    const parseMock = ImportMock.mockFunction(
      GateioSymbolModule,
      'parse',
    )

    const rawSymbol = GATEIO_RAW_SYMBOLS[0]

    parseMock
      .onFirstCall()
      .returns(GATEIO_PARSED_SYMBOLS[0])
      .onSecondCall()
      .returns(GATEIO_PARSED_SYMBOLS[1])
      .onThirdCall()
      .returns(GATEIO_PARSED_SYMBOLS[2])

    const parsedSymbols = GateioSymbolModule.parseMany({
      rawSymbols: [rawSymbol, rawSymbol, rawSymbol],
    })

    for (let index = 0; index < 3; index += 1) {

      expect(parsedSymbols[index].exchangeId).to.be.eq(Gateio.ID)
      expect(parsedSymbols[index].id).to.be.eq(GATEIO_PARSED_SYMBOLS[index].id)

    }

    expect(parseMock.callCount).to.be.eq(3)
    expect(parseMock.calledWith({ rawSymbol }))

  })

})
