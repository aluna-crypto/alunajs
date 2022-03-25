import { expect } from 'chai'
import { ImportMock } from 'ts-mock-imports'

import { mockAlunaSymbolMapping } from '../../../utils/mappings/AlunaSymbolMapping.mock'
import { Poloniex } from '../Poloniex'
import { PoloniexHttp } from '../PoloniexHttp'
import { PoloniexCurrencyParser } from '../schemas/parsers/PoloniexCurrencyParser'
import {
  POLONIEX_PARSED_SYMBOLS,
  POLONIEX_RAW_SYMBOL,
  POLONIEX_RAW_SYMBOLS_WITH_CURRENCY,
} from '../test/fixtures/poloniexSymbol'
import { PoloniexSymbolModule } from './PoloniexSymbolModule'



describe('PoloniexSymbolModule', () => {


  it('should list Poloniex raw symbols just fine', async () => {

    const requestMock = ImportMock.mockFunction(
      PoloniexHttp,
      'publicRequest',
      Promise.resolve({
        data: POLONIEX_RAW_SYMBOL,
        apiRequestCount: 1,
      }),
    )

    const parserMock = ImportMock.mockFunction(
      PoloniexCurrencyParser,
      'parse',
      POLONIEX_RAW_SYMBOLS_WITH_CURRENCY,
    )

    const { rawSymbols, apiRequestCount } = await PoloniexSymbolModule.listRaw()

    expect(apiRequestCount).to.be.eq(2)

    expect(rawSymbols.length).to.eq(3)
    expect(rawSymbols).to.deep.eq(POLONIEX_RAW_SYMBOLS_WITH_CURRENCY)

    expect(requestMock.callCount).to.be.eq(1)
    expect(parserMock.callCount).to.be.eq(1)

  })



  it('should list Poloniex parsed symbols just fine', async () => {

    const listRawMock = ImportMock.mockFunction(
      PoloniexSymbolModule,
      'listRaw',
      Promise.resolve({
        rawSymbols: POLONIEX_RAW_SYMBOLS_WITH_CURRENCY,
        apiRequestCount: 1,
      }),
    )

    const parseManyMock = ImportMock.mockFunction(
      PoloniexSymbolModule,
      'parseMany',
      {
        symbols: POLONIEX_PARSED_SYMBOLS,
        apiRequestCount: 1,
      },
    )


    const { symbols } = await PoloniexSymbolModule.list()

    expect(symbols.length).to.eq(3)
    expect(symbols).to.deep.eq(POLONIEX_PARSED_SYMBOLS)

    for (let index = 0; index < 3; index += 1) {

      expect(symbols[index].exchangeId).to.be.eq(Poloniex.ID)
      expect(symbols[index].id).to.be.eq(POLONIEX_PARSED_SYMBOLS[index].id)
      expect(symbols[index].name)
        .to.be.eq(POLONIEX_PARSED_SYMBOLS[index].name)

    }

    expect(listRawMock.callCount).to.eq(1)

    expect(parseManyMock.callCount).to.eq(1)
    expect(parseManyMock.calledWith({
      rawSymbols: POLONIEX_RAW_SYMBOLS_WITH_CURRENCY,
    })).to.be.ok

  })



  it('should parse a Poloniex symbol just fine', async () => {

    const translateSymbolId = 'ETH'

    const { alunaSymbolMappingMock } = mockAlunaSymbolMapping({
      returnSymbol: translateSymbolId,
    })

    const rawSymbol1 = POLONIEX_RAW_SYMBOLS_WITH_CURRENCY[1]
    const rawSymbol2 = POLONIEX_RAW_SYMBOLS_WITH_CURRENCY[2]

    const { symbol: parsedSymbol1 } = PoloniexSymbolModule.parse({
      rawSymbol: rawSymbol1,
    })

    expect(parsedSymbol1.exchangeId).to.be.eq(Poloniex.ID)
    expect(parsedSymbol1.id).to.be.eq(translateSymbolId)
    expect(parsedSymbol1.name).to.be.eq(rawSymbol1.name)
    expect(parsedSymbol1.alias).to.be.eq(rawSymbol1.currency)

    expect(alunaSymbolMappingMock.callCount).to.be.eq(1)
    expect(alunaSymbolMappingMock.args[0][0]).to.deep.eq({
      exchangeSymbolId: rawSymbol1.currency,
      symbolMappings: Poloniex.settings.mappings,
    })

    alunaSymbolMappingMock.returns(rawSymbol2.currency)

    const { symbol: parsedSymbol2 } = PoloniexSymbolModule.parse({
      rawSymbol: rawSymbol2,
    })

    expect(parsedSymbol2.exchangeId).to.be.eq(Poloniex.ID)
    expect(parsedSymbol2.id).to.be.eq(rawSymbol2.currency)
    expect(parsedSymbol2.name).to.be.eq(rawSymbol2.name)
    expect(parsedSymbol2.alias).not.to.be.ok

    expect(alunaSymbolMappingMock.callCount).to.be.eq(2)
    expect(alunaSymbolMappingMock.args[1][0]).to.deep.eq({
      exchangeSymbolId: rawSymbol2.currency,
      symbolMappings: Poloniex.settings.mappings,
    })

  })



  it('should parse many Poloniex symbols just fine', async () => {

    const parseMock = ImportMock.mockFunction(
      PoloniexSymbolModule,
      'parse',
    )

    const rawSymbol = POLONIEX_RAW_SYMBOL[0]

    parseMock
      .onFirstCall()
      .returns({
        symbol: POLONIEX_PARSED_SYMBOLS[0],
        apiRequestCount: 1,
      })
      .onSecondCall()
      .returns({
        symbol: POLONIEX_PARSED_SYMBOLS[1],
        apiRequestCount: 1,
      })
      .onThirdCall()
      .returns({
        symbol: POLONIEX_PARSED_SYMBOLS[2],
        apiRequestCount: 1,
      })

    const { symbols: parsedSymbols } = PoloniexSymbolModule.parseMany({
      rawSymbols: [rawSymbol, rawSymbol, rawSymbol],
    })

    for (let index = 0; index < 3; index += 1) {

      expect(parsedSymbols[index].exchangeId).to.be.eq(Poloniex.ID)
      expect(parsedSymbols[index].id)
        .to.be.eq(POLONIEX_PARSED_SYMBOLS[index].id)

    }

    expect(parseMock.callCount).to.be.eq(3)
    expect(parseMock.calledWith({ rawSymbol }))

  })

})
