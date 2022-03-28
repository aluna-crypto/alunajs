import { expect } from 'chai'
import { ImportMock } from 'ts-mock-imports'

import { Bitfinex } from '../Bitfinex'
import { BitfinexHttp } from '../BitfinexHttp'
import * as BitfinexSymbolParserMod from '../schemas/parsers/BitfinexSymbolParser'
import {
  BITFINEX_CURRENCIES,
  BITFINEX_CURRENCIES_LABELS,
  BITFINEX_PARSED_SYMBOLS,
  BITFINEX_RAW_SYMBOLS,
} from '../test/fixtures/bitfinexSymbols'
import {
  BitfinexSymbolModule,
  IBitfinexParseSymbolParams,
} from './BitfinexSymbolModule'



describe('BitfinexSymbolModule', () => {

  it('should list Bitfinex raw symbols just fine', async () => {

    const requestMock = ImportMock.mockFunction(
      BitfinexHttp,
      'publicRequest',
      Promise.resolve({
        data: BITFINEX_RAW_SYMBOLS,
        apiRequestCount: 1,
      }),
    )

    const { rawSymbols } = await BitfinexSymbolModule.listRaw()

    expect(rawSymbols.length).to.eq(BITFINEX_RAW_SYMBOLS.length)
    expect(rawSymbols).to.deep.eq(BITFINEX_RAW_SYMBOLS)

    expect(requestMock.callCount).to.be.eq(1)

  })

  it('should list Bitfinex parsed symbols just fine', async () => {

    const listRawMock = ImportMock.mockFunction(
      BitfinexSymbolModule,
      'listRaw',
      Promise.resolve({
        rawSymbols: BITFINEX_RAW_SYMBOLS,
        apiRequestCount: 1,
      }),
    )

    const parseManyMock = ImportMock.mockFunction(
      BitfinexSymbolModule,
      'parseMany',
      {
        symbols: BITFINEX_PARSED_SYMBOLS,
        apiRequestCount: 1,
      },
    )

    const { symbols: parsedSymbols } = await BitfinexSymbolModule.list()

    expect(parsedSymbols.length).to.eq(BITFINEX_PARSED_SYMBOLS.length)
    expect(parsedSymbols).to.deep.eq(BITFINEX_PARSED_SYMBOLS)

    expect(parsedSymbols[0].exchangeId).to.be.eq(Bitfinex.ID)
    expect(parsedSymbols[0].id).to.be.eq(BITFINEX_PARSED_SYMBOLS[0].id)
    expect(parsedSymbols[0].name).to.be.eq(BITFINEX_PARSED_SYMBOLS[0].name)

    expect(parsedSymbols[1].exchangeId).to.be.eq(Bitfinex.ID)
    expect(parsedSymbols[1].id).to.be.eq(BITFINEX_PARSED_SYMBOLS[1].id)
    expect(parsedSymbols[1].name).to.be.eq(BITFINEX_PARSED_SYMBOLS[1].name)

    expect(parsedSymbols[2].exchangeId).to.be.eq(Bitfinex.ID)
    expect(parsedSymbols[2].id).to.be.eq(BITFINEX_PARSED_SYMBOLS[2].id)
    expect(parsedSymbols[2].name).to.be.eq(BITFINEX_PARSED_SYMBOLS[2].name)

    expect(listRawMock.callCount).to.eq(1)
    expect(parseManyMock.callCount).to.eq(1)

    expect(parseManyMock.calledWith({
      rawSymbols: BITFINEX_RAW_SYMBOLS,
    })).to.be.ok

    expect(parseManyMock.returned({
      symbols: parsedSymbols,
      apiRequestCount: 1,
    })).to.be.ok

  })

  it('should parse a Bitfinex symbol just fine', async () => {

    const parserMock = ImportMock.mockFunction(
      BitfinexSymbolParserMod.BitfinexSymbolParser,
      'parse',
      BITFINEX_PARSED_SYMBOLS[0],
    )

    const rawSymbol: IBitfinexParseSymbolParams = {
      bitfinexCurrency: BITFINEX_CURRENCIES[0][1],
      bitfinexCurrencyLabel: BITFINEX_CURRENCIES_LABELS[1],
    }

    const { symbol: parsedSymbol1 } = BitfinexSymbolModule.parse({
      rawSymbol,
    })

    expect(parserMock.callCount).to.be.eq(1)
    expect(parserMock.calledWithExactly(rawSymbol)).to.be.ok
    expect(parsedSymbol1).to.deep.eq(BITFINEX_PARSED_SYMBOLS[0])

    // new mocking
    parserMock.returns(BITFINEX_PARSED_SYMBOLS[1])

    const rawSymbol2: IBitfinexParseSymbolParams = {
      bitfinexCurrency: BITFINEX_CURRENCIES[0][1],
      bitfinexCurrencyLabel: BITFINEX_CURRENCIES_LABELS[1],
    }

    const { symbol: parsedSymbol2 } = BitfinexSymbolModule.parse({
      rawSymbol: rawSymbol2,
    })

    expect(parserMock.callCount).to.be.eq(2)
    expect(parserMock.calledWithExactly(rawSymbol2)).to.be.ok
    expect(parsedSymbol2).to.deep.eq(BITFINEX_PARSED_SYMBOLS[1])

  })

  it('should parse many Bitfinex symbols just fine', async () => {

    const parseMock = ImportMock.mockFunction(
      BitfinexSymbolModule,
      'parse',
    )

    BITFINEX_PARSED_SYMBOLS.forEach((parsed, index) => {

      parseMock.onCall(index).returns({
        symbol: parsed,
        apiRequestCount: 1,
      })

    })

    const { symbols: parsedSymbols } = BitfinexSymbolModule.parseMany({
      rawSymbols: BITFINEX_RAW_SYMBOLS,
    })

    expect(parsedSymbols.length).to.be.eq(BITFINEX_PARSED_SYMBOLS.length)

    parsedSymbols.forEach((parsed, index) => {

      expect(parsed.exchangeId).to.be.eq(Bitfinex.ID)
      expect(parsed.id).to.be.eq(BITFINEX_PARSED_SYMBOLS[index].id)
      expect(parsed.name).to.be.eq(BITFINEX_PARSED_SYMBOLS[index].name)

    })

  })

})
