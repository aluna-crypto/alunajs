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
      Promise.resolve({
        data: BITTREX_RAW_SYMBOLS,
        requestCount: 1,
      }),
    )

    const { rawSymbols, requestCount } = await BittrexSymbolModule.listRaw()

    expect(requestCount).to.be.eq(1)

    expect(rawSymbols.length).to.eq(3)
    expect(rawSymbols).to.deep.eq(BITTREX_RAW_SYMBOLS)

    expect(requestMock.callCount).to.be.eq(1)

  })



  it('should list Bittrex parsed symbols just fine', async () => {

    const listRawMock = ImportMock.mockFunction(
      BittrexSymbolModule,
      'listRaw',
      Promise.resolve({
        rawSymbols: BITTREX_RAW_SYMBOLS,
        requestCount: 1,
      }),
    )

    const parseManyMock = ImportMock.mockFunction(
      BittrexSymbolModule,
      'parseMany',
      {
        symbols: BITTREX_PARSED_SYMBOLS,
        requestCount: 1,
      },
    )


    const { symbols: parsedSymbols } = await BittrexSymbolModule.list()

    expect(parsedSymbols.length).to.eq(3)
    expect(parsedSymbols).to.deep.eq(BITTREX_PARSED_SYMBOLS)

    for (let index = 0; index < 3; index += 1) {

      expect(parsedSymbols[index].exchangeId).to.be.eq(Bittrex.ID)
      expect(parsedSymbols[index].id).to.be.eq(BITTREX_PARSED_SYMBOLS[index].id)
      expect(parsedSymbols[index].name)
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

    const { symbol: parsedSymbol1 } = BittrexSymbolModule.parse({
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

    const { symbol: parsedSymbol2 } = BittrexSymbolModule.parse({
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
      .returns({ symbol: BITTREX_PARSED_SYMBOLS[0], requestCount: 1 })
      .onSecondCall()
      .returns({ symbol: BITTREX_PARSED_SYMBOLS[1], requestCount: 1 })
      .onThirdCall()
      .returns({ symbol: BITTREX_PARSED_SYMBOLS[2], requestCount: 1 })

    const { symbols: parsedSymbols } = BittrexSymbolModule.parseMany({
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
