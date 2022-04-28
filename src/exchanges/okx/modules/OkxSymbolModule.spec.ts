import { expect } from 'chai'
import { each } from 'lodash'
import { ImportMock } from 'ts-mock-imports'

import { AlunaSymbolMapping } from '../../../utils/mappings/AlunaSymbolMapping'
import { OkxSymbolTypeEnum } from '../enums/OkxSymbolTypeEnum'
import * as FetchOkxInstrumentsMod from '../helpers/FetchOkxInstruments'
import { Okx } from '../Okx'
import {
  OKX_PARSED_SYMBOLS,
  OKX_RAW_SUSPENDED_SYMBOL,
  OKX_RAW_SPOT_SYMBOLS,
} from '../test/fixtures/okxSymbol'
import { OkxSymbolModule } from './OkxSymbolModule'



describe('OkxSymbolModule', () => {


  it('should list Okx raw symbols just fine', async () => {

    const requestMock = ImportMock.mockFunction(
      FetchOkxInstrumentsMod,
      'fetchOkxInstruments',
      Promise.resolve({
        rawSymbols: OKX_RAW_SPOT_SYMBOLS,
        requestCount: 1,
      }),
    )

    const { rawSymbols } = await OkxSymbolModule.listRaw()

    expect(rawSymbols.length).to.eq(8)
    expect(rawSymbols).to.deep.eq(
      [...OKX_RAW_SPOT_SYMBOLS, ...OKX_RAW_SPOT_SYMBOLS],
    )

    expect(requestMock.callCount).to.be.eq(2)

    expect(requestMock.calledWith({
      type: OkxSymbolTypeEnum.SPOT,
    })).to.be.ok

    expect(requestMock.calledWith({
      type: OkxSymbolTypeEnum.MARGIN,
    })).to.be.ok

  })

  it('should list Okx parsed symbols just fine', async () => {

    const listRawMock = ImportMock.mockFunction(
      OkxSymbolModule,
      'listRaw',
      Promise.resolve({
        rawSymbols: OKX_RAW_SPOT_SYMBOLS,
        requestCount: 1,
      }),
    )

    const parseManyMock = ImportMock.mockFunction(
      OkxSymbolModule,
      'parseMany',
      {
        symbols: OKX_PARSED_SYMBOLS,
        requestCount: 1,
      },
    )


    const { symbols: parsedSymbols } = await OkxSymbolModule.list()

    expect(parsedSymbols.length).to.eq(5)
    expect(parsedSymbols).to.deep.eq(OKX_PARSED_SYMBOLS)

    expect(listRawMock.callCount).to.eq(1)

    expect(parseManyMock.callCount).to.eq(1)
    expect(parseManyMock.calledWith({
      rawSymbols: OKX_RAW_SPOT_SYMBOLS,
    })).to.be.ok

  })

  it('should parse a Okx symbol just fine', async () => {

    const rawSymbol1 = OKX_RAW_SPOT_SYMBOLS[0]
    const rawSymbol2 = OKX_RAW_SPOT_SYMBOLS[1]

    const translatedSymbol = 'ETH'

    const symbolMappingMock = ImportMock.mockFunction(
      AlunaSymbolMapping,
      'translateSymbolId',
      translatedSymbol,
    )

    const { symbol: parsedSymbol1 } = OkxSymbolModule.parse({
      rawSymbol: rawSymbol1,
    })

    expect(parsedSymbol1.exchangeId).to.be.eq(Okx.ID)
    expect(parsedSymbol1.id).to.be.eq(translatedSymbol)
    expect(parsedSymbol1.alias).to.be.eq(rawSymbol1.baseCcy)


    symbolMappingMock.returns(rawSymbol2.baseCcy)

    const { symbol: parsedSymbol2 } = OkxSymbolModule.parse({
      rawSymbol: rawSymbol2,
    })

    expect(parsedSymbol2.exchangeId).to.be.eq(Okx.ID)
    expect(parsedSymbol2.id).to.be.eq(rawSymbol2.baseCcy)
    expect(parsedSymbol2.alias).to.be.eq(undefined)

  })

  it('should parse many Okx symbols just fine', async () => {

    const parseMock = ImportMock.mockFunction(
      OkxSymbolModule,
      'parse',
    )

    const rawSymbols = [OKX_RAW_SUSPENDED_SYMBOL, ...OKX_RAW_SPOT_SYMBOLS]

    each(OKX_PARSED_SYMBOLS, (parsed, i) => {

      parseMock.onCall(i).returns({ symbol: parsed, requestCount: 1 })

    })

    const { symbols: parsedSymbols } = OkxSymbolModule.parseMany({
      rawSymbols,
    })

    expect(parsedSymbols).to.deep.eq(OKX_PARSED_SYMBOLS)

    expect(parseMock.callCount).to.be.eq(5)

  })

})
