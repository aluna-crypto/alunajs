import { expect } from 'chai'
import { ImportMock } from 'ts-mock-imports'

import { mockAlunaSymbolMapping } from '../../../utils/mappings/AlunaSymbolMapping.mock'
import { Bittrex } from '../Bittrex'
import { BittrexHttp } from '../BittrexHttp'
import {
  BITTREX_PARSED_SYMBOLS,
  BITTREX_RAW_SYMBOLS,
} from '../test/fixtures/bittrexSymbol'
import { BittrexSymbolModule } from './BittrexSymbolModule'



describe('BittrexSymbolModule', () => {


  it('should list Bittrex raw symbols just fine', async () => {

    const requestMock = ImportMock.mockFunction(
      BittrexHttp,
      'publicRequest',
      Promise.resolve(BITTREX_RAW_SYMBOLS),
    )

    const rawSymbols = await BittrexSymbolModule.listRaw()

    expect(rawSymbols.length).to.eq(3)
    expect(rawSymbols).to.deep.eq(BITTREX_RAW_SYMBOLS)

    expect(requestMock.callCount).to.be.eq(1)

  })



  it('should list Bittrex parsed symbols just fine', async () => {

    const listRawMock = ImportMock.mockFunction(
      BittrexSymbolModule,
      'listRaw',
      Promise.resolve(BITTREX_RAW_SYMBOLS),
    )

    const parseManyMock = ImportMock.mockFunction(
      BittrexSymbolModule,
      'parseMany',
      BITTREX_PARSED_SYMBOLS,
    )


    const rawSymbols = await BittrexSymbolModule.list()

    expect(rawSymbols.length).to.eq(3)
    expect(rawSymbols).to.deep.eq(BITTREX_PARSED_SYMBOLS)

    for (let index = 0; index < 3; index += 1) {

      expect(rawSymbols[index].exchangeId).to.be.eq(Bittrex.ID)
      expect(rawSymbols[index].id).to.be.eq(BITTREX_PARSED_SYMBOLS[index].id)
      expect(rawSymbols[index].name)
        .to.be.eq(BITTREX_PARSED_SYMBOLS[index].name)

    }

    expect(listRawMock.callCount).to.eq(1)

    expect(parseManyMock.callCount).to.eq(1)
    expect(parseManyMock.calledWith({
      rawSymbols: BITTREX_RAW_SYMBOLS,
    })).to.be.ok

  })



  it('should parse a Bittrex symbol just fine', async () => {

    const translatedSymbolId = 'ETH'

    const { alunaSymbolMappingMock } = mockAlunaSymbolMapping({
      returnSymbol: translatedSymbolId,
    })

    const rawSymbol1 = BITTREX_RAW_SYMBOLS[1]
    const rawSymbol2 = BITTREX_RAW_SYMBOLS[2]

    const parsedSymbol1 = BittrexSymbolModule.parse({
      rawSymbol: rawSymbol1,
    })

    expect(parsedSymbol1.exchangeId).to.be.eq(Bittrex.ID)
    expect(parsedSymbol1.id).to.be.eq(translatedSymbolId)
    expect(parsedSymbol1.name).to.be.eq(rawSymbol1.name)

    expect(alunaSymbolMappingMock.callCount).to.be.eq(1)
    expect(alunaSymbolMappingMock.args[0][0]).to.deep.eq({
      exchangeSymbolId: rawSymbol1.symbol,
      symbolMappings: {},
    })

    alunaSymbolMappingMock.returns(rawSymbol2.symbol)

    const parsedSymbol2 = BittrexSymbolModule.parse({
      rawSymbol: rawSymbol2,
    })

    expect(parsedSymbol2.exchangeId).to.be.eq(Bittrex.ID)
    expect(parsedSymbol2.id).to.be.eq(rawSymbol2.symbol)
    expect(parsedSymbol2.name).to.be.eq(rawSymbol2.name)

    expect(alunaSymbolMappingMock.callCount).to.be.eq(2)
    expect(alunaSymbolMappingMock.args[1][0]).to.deep.eq({
      exchangeSymbolId: rawSymbol2.symbol,
      symbolMappings: {},
    })

  })



  it('should parse many Bittrex symbols just fine', async () => {

    const parseMock = ImportMock.mockFunction(
      BittrexSymbolModule,
      'parse',
    )

    const rawSymbol = BITTREX_RAW_SYMBOLS[0]

    parseMock
      .onFirstCall()
      .returns(BITTREX_PARSED_SYMBOLS[0])
      .onSecondCall()
      .returns(BITTREX_PARSED_SYMBOLS[1])
      .onThirdCall()
      .returns(BITTREX_PARSED_SYMBOLS[2])

    const parsedSymbols = BittrexSymbolModule.parseMany({
      rawSymbols: [rawSymbol, rawSymbol, rawSymbol],
    })

    for (let index = 0; index < 3; index += 1) {

      expect(parsedSymbols[index].exchangeId).to.be.eq(Bittrex.ID)
      expect(parsedSymbols[index].id).to.be.eq(BITTREX_PARSED_SYMBOLS[index].id)

    }

    expect(parseMock.callCount).to.be.eq(3)
    expect(parseMock.calledWith({ rawSymbol }))

  })

})
