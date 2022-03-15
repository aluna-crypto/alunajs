import { expect } from 'chai'
import { ImportMock } from 'ts-mock-imports'

import { mockAlunaSymbolMapping } from '../../../utils/mappings/AlunaSymbolMapping.mock'
import {
  VALR_PARSED_SYMBOLS,
  VALR_RAW_SYMBOLS,
} from '../test/fixtures/valrSymbols'
import { Valr } from '../Valr'
import { ValrHttp } from '../ValrHttp'
import { ValrSymbolModule } from './ValrSymbolModule'



describe('ValrSymbolModule', () => {

  it('should list Valr raw symbols just fine', async () => {

    const requestResponse = {
      data: VALR_RAW_SYMBOLS,
      apiRequestCount: 1,
    }

    const requestMock = ImportMock.mockFunction(
      ValrHttp,
      'publicRequest',
      requestResponse,
    )

    const { apiRequestCount, rawSymbols } = await ValrSymbolModule.listRaw()

    expect(apiRequestCount).to.eq(1)
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

    const listRawResponse = {
      rawSymbols: mockedRawSymbols,
      apiRequestCount: 1,
    }

    const listRawMock = ImportMock.mockFunction(
      ValrSymbolModule,
      'listRaw',
      listRawResponse,
    )

    const parseManyResponse = {
      symbols: VALR_PARSED_SYMBOLS,
      apiRequestCount: 3,
    }

    const parseManyMock = ImportMock.mockFunction(
      ValrSymbolModule,
      'parseMany',
      parseManyResponse,
    )

    const {
      symbols: rawSymbols,
      apiRequestCount,
    } = await ValrSymbolModule.list()

    expect(apiRequestCount).to.eq(3)
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

    const expectedSymbol = 'ETH'

    const { alunaSymbolMappingMock } = mockAlunaSymbolMapping({
      returnSymbol: expectedSymbol,
    })

    const rawSymbol1 = VALR_RAW_SYMBOLS[1]
    const rawSymbol2 = VALR_RAW_SYMBOLS[2]

    const {
      symbol: parsedSymbol1,
      apiRequestCount: apiRequestCount1,
    } = ValrSymbolModule.parse({
      rawSymbol: rawSymbol1,
    })

    expect(apiRequestCount1).to.be.eq(1)
    expect(parsedSymbol1.exchangeId).to.be.eq(Valr.ID)
    expect(parsedSymbol1.id).to.be.eq(expectedSymbol)
    expect(parsedSymbol1.name).to.be.eq(rawSymbol1.longName)
    expect(parsedSymbol1.alias).to.be.eq(rawSymbol1.shortName)

    expect(alunaSymbolMappingMock.callCount).to.be.eq(1)
    expect(alunaSymbolMappingMock.args[0][0]).to.deep.eq({
      exchangeSymbolId: rawSymbol1.shortName,
      symbolMappings: {},
    })

    alunaSymbolMappingMock.returns(rawSymbol2.shortName)

    const {
      symbol: parsedSymbol2,
      apiRequestCount: apiRequestCount2,
    } = ValrSymbolModule.parse({
      rawSymbol: rawSymbol2,
    })

    expect(apiRequestCount2).to.be.eq(1)
    expect(parsedSymbol2.exchangeId).to.be.eq(Valr.ID)
    expect(parsedSymbol2.id).to.be.eq(expectedSymbol)
    expect(parsedSymbol2.name).to.be.eq(rawSymbol2.longName)
    expect(parsedSymbol2.alias).not.to.be.ok

    expect(alunaSymbolMappingMock.callCount).to.be.eq(2)
    expect(alunaSymbolMappingMock.args[1][0]).to.deep.eq({
      exchangeSymbolId: rawSymbol2.shortName,
      symbolMappings: {},
    })

  })

  it('should parse many Valr symbols just fine', async () => {

    const parseMock = ImportMock.mockFunction(
      ValrSymbolModule,
      'parse',
    )

    const rawSymbol = {}

    const parsedSymbolResp1 = {
      symbol: VALR_PARSED_SYMBOLS[0],
      apiRequestCount: 1,
    }

    const parsedSymbolResp2 = {
      symbol: VALR_PARSED_SYMBOLS[1],
      apiRequestCount: 1,
    }

    const parsedSymbolResp3 = {
      symbol: VALR_PARSED_SYMBOLS[0],
      apiRequestCount: 1,
    }

    parseMock
      .onFirstCall()
      .returns(parsedSymbolResp1)
      .onSecondCall()
      .returns(parsedSymbolResp2)
      .onThirdCall()
      .returns(parsedSymbolResp3)

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
