import { expect } from 'chai'
import { ImportMock } from 'ts-mock-imports'

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

    const parsedSymbol1 = BittrexSymbolModule.parse({
      rawSymbol: BITTREX_RAW_SYMBOLS[1],
    })

    expect(parsedSymbol1.exchangeId).to.be.eq(Bittrex.ID)
    expect(parsedSymbol1.id).to.be.eq(BITTREX_RAW_SYMBOLS[1].symbol)
    expect(parsedSymbol1.name).to.be.eq(BITTREX_RAW_SYMBOLS[1].name)

    const parsedSymbol2 = BittrexSymbolModule.parse({
      rawSymbol: BITTREX_RAW_SYMBOLS[2],
    })

    expect(parsedSymbol2.exchangeId).to.be.eq(Bittrex.ID)
    expect(parsedSymbol2.id).to.be.eq(BITTREX_RAW_SYMBOLS[2].symbol)
    expect(parsedSymbol2.name).to.be.eq(BITTREX_RAW_SYMBOLS[2].name)

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
