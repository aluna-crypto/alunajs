import { expect } from 'chai'
import { ImportMock } from 'ts-mock-imports'

import {
  VALR_PARSED_SYMBOLS,
  VALR_RAW_SYMBOLS,
} from '../test/fixtures/valrSymbols'
import { Valr } from '../Valr'
import { ValrHttp } from '../ValrHttp'
import { ValrSymbolModule } from './ValrSymbolModule'



describe('ValrSymbolModule', () => {


  it('should list Valr raw symbols just fine', async () => {

    const requestMock = ImportMock.mockFunction(
      ValrHttp,
      'publicRequest',
      Promise.resolve(VALR_RAW_SYMBOLS),
    )

    const rawSymbols = await ValrSymbolModule.listRaw()

    expect(rawSymbols.length).to.eq(3)
    expect(rawSymbols).to.deep.eq(VALR_RAW_SYMBOLS)

    expect(rawSymbols[0].symbol).to.be.eq(VALR_RAW_SYMBOLS[0].symbol)
    expect(rawSymbols[0].shortName).to.be.eq(VALR_RAW_SYMBOLS[0].shortName)
    expect(rawSymbols[0].longName).to.be.eq(VALR_RAW_SYMBOLS[0].longName)

    expect(rawSymbols[1].symbol).to.be.eq(VALR_RAW_SYMBOLS[1].symbol)
    expect(rawSymbols[1].shortName).to.be.eq(VALR_RAW_SYMBOLS[1].shortName)
    expect(rawSymbols[1].longName).to.be.eq(VALR_RAW_SYMBOLS[1].longName)

    expect(rawSymbols[2].symbol).to.be.eq(VALR_RAW_SYMBOLS[2].symbol)
    expect(rawSymbols[2].shortName).to.be.eq(VALR_RAW_SYMBOLS[2].shortName)
    expect(rawSymbols[2].longName).to.be.eq(VALR_RAW_SYMBOLS[2].longName)

    expect(requestMock.callCount).to.be.eq(1)

  })



  it('should list Valr parsed symbols just fine', async () => {

    const mockedRawSymbols = 'raw-symbols'

    const listRawMock = ImportMock.mockFunction(
      ValrSymbolModule,
      'listRaw',
      Promise.resolve(mockedRawSymbols),
    )

    const parseManyMock = ImportMock.mockFunction(
      ValrSymbolModule,
      'parseMany',
      VALR_PARSED_SYMBOLS,
    )


    const rawSymbols = await ValrSymbolModule.list()

    expect(rawSymbols.length).to.eq(3)
    expect(rawSymbols).to.deep.eq(VALR_PARSED_SYMBOLS)

    expect(rawSymbols[0].exchangeId).to.be.eq(Valr.ID)
    expect(rawSymbols[0].id).to.be.eq(VALR_PARSED_SYMBOLS[0].id)
    expect(rawSymbols[0].name).to.be.eq(VALR_PARSED_SYMBOLS[0].name)

    expect(rawSymbols[1].exchangeId).to.be.eq(Valr.ID)
    expect(rawSymbols[1].id).to.be.eq(VALR_PARSED_SYMBOLS[1].id)
    expect(rawSymbols[1].name).to.be.eq(VALR_PARSED_SYMBOLS[1].name)

    expect(rawSymbols[2].exchangeId).to.be.eq(Valr.ID)
    expect(rawSymbols[2].id).to.be.eq(VALR_PARSED_SYMBOLS[2].id)
    expect(rawSymbols[2].name).to.be.eq(VALR_PARSED_SYMBOLS[2].name)

    expect(listRawMock.callCount).to.eq(1)

    expect(parseManyMock.callCount).to.eq(1)
    expect(parseManyMock.calledWith({
      rawSymbols: mockedRawSymbols,
    })).to.be.ok

  })



  it('should parse a Valr symbol just fine', async () => {

    const parsedSymbol1 = ValrSymbolModule.parse({
      rawSymbol: VALR_RAW_SYMBOLS[1],
    })

    expect(parsedSymbol1.exchangeId).to.be.eq(Valr.ID)
    expect(parsedSymbol1.id).to.be.eq(VALR_RAW_SYMBOLS[1].shortName)
    expect(parsedSymbol1.name).to.be.eq(VALR_RAW_SYMBOLS[1].longName)

    const parsedSymbol2 = ValrSymbolModule.parse({
      rawSymbol: VALR_RAW_SYMBOLS[2],
    })

    expect(parsedSymbol2.exchangeId).to.be.eq(Valr.ID)
    expect(parsedSymbol2.id).to.be.eq(VALR_RAW_SYMBOLS[2].shortName)
    expect(parsedSymbol2.name).to.be.eq(VALR_RAW_SYMBOLS[2].longName)

  })



  it('should parse many Valr symbols just fine', async () => {

    const parseMock = ImportMock.mockFunction(
      ValrSymbolModule,
      'parse',
    )

    const rawSymbol = {}

    parseMock
      .onFirstCall()
      .returns(VALR_PARSED_SYMBOLS[0])
      .onSecondCall()
      .returns(VALR_PARSED_SYMBOLS[1])
      .onThirdCall()
      .returns(VALR_PARSED_SYMBOLS[2])

    const parsedSymbols = ValrSymbolModule.parseMany({
      rawSymbols: [rawSymbol, rawSymbol, rawSymbol],
    })

    expect(parsedSymbols[0].exchangeId).to.be.eq(Valr.ID)
    expect(parsedSymbols[0].id).to.be.eq(VALR_PARSED_SYMBOLS[0].id)
    expect(parsedSymbols[0].name).to.be.eq(VALR_PARSED_SYMBOLS[0].name)

    expect(parsedSymbols[1].exchangeId).to.be.eq(Valr.ID)
    expect(parsedSymbols[1].id).to.be.eq(VALR_PARSED_SYMBOLS[1].id)
    expect(parsedSymbols[1].name).to.be.eq(VALR_PARSED_SYMBOLS[1].name)

    expect(parsedSymbols[2].exchangeId).to.be.eq(Valr.ID)
    expect(parsedSymbols[2].id).to.be.eq(VALR_PARSED_SYMBOLS[2].id)
    expect(parsedSymbols[2].name).to.be.eq(VALR_PARSED_SYMBOLS[2].name)

    expect(parseMock.callCount).to.be.eq(3)
    expect(parseMock.calledWith({ rawSymbol }))

  })

})
