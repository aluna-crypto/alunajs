import { expect } from 'chai'
import { each } from 'lodash'
import { ImportMock } from 'ts-mock-imports'

import { AlunaSymbolMapping } from '../../../utils/mappings/AlunaSymbolMapping'
import { Huobi } from '../Huobi'
import { HuobiHttp } from '../HuobiHttp'
import {
  HUOBI_PARSED_SYMBOLS,
  HUOBI_RAW_SYMBOLS,
} from '../test/fixtures/huobiSymbols'
import { HuobiSymbolModule } from './HuobiSymbolModule'



describe('HuobiSymbolModule', () => {


  it('should list Huobi raw symbols just fine', async () => {

    const requestMock = ImportMock.mockFunction(
      HuobiHttp,
      'publicRequest',
      Promise.resolve({
        data: HUOBI_RAW_SYMBOLS,
        requestCount: 1,
      }),
    )

    const { rawSymbols } = await HuobiSymbolModule.listRaw()

    expect(rawSymbols.length).to.eq(4)
    expect(rawSymbols).to.deep.eq(HUOBI_RAW_SYMBOLS)

    expect(requestMock.callCount).to.be.eq(1)

  })

  it('should list Huobi parsed symbols just fine', async () => {

    const listRawMock = ImportMock.mockFunction(
      HuobiSymbolModule,
      'listRaw',
      Promise.resolve({
        rawSymbols: HUOBI_RAW_SYMBOLS,
        requestCount: 1,
      }),
    )

    const parseManyMock = ImportMock.mockFunction(
      HuobiSymbolModule,
      'parseMany',
      {
        symbols: HUOBI_PARSED_SYMBOLS,
        requestCount: 1,
      },
    )


    const { symbols: parsedSymbols } = await HuobiSymbolModule.list()

    expect(parsedSymbols.length).to.eq(4)
    expect(parsedSymbols).to.deep.eq(HUOBI_PARSED_SYMBOLS)

    expect(listRawMock.callCount).to.eq(1)

    expect(parseManyMock.callCount).to.eq(1)
    expect(parseManyMock.calledWith({
      rawSymbols: HUOBI_RAW_SYMBOLS,
    })).to.be.ok

  })

  it('should parse a Huobi symbol just fine', async () => {

    const rawSymbol1 = HUOBI_RAW_SYMBOLS[0]
    const rawSymbol2 = HUOBI_RAW_SYMBOLS[1]

    const translatedSymbol = 'BTC'

    const symbolMappingMock = ImportMock.mockFunction(
      AlunaSymbolMapping,
      'translateSymbolId',
      translatedSymbol,
    )

    const { symbol: parsedSymbol1 } = HuobiSymbolModule.parse({
      rawSymbol: rawSymbol1,
    })

    expect(parsedSymbol1.exchangeId).to.be.eq(Huobi.ID)
    expect(parsedSymbol1.id).to.be.eq(translatedSymbol)
    expect(parsedSymbol1.alias).to.be.eq(rawSymbol1.bc)


    symbolMappingMock.returns(rawSymbol2.bc)

    const { symbol: parsedSymbol2 } = HuobiSymbolModule.parse({
      rawSymbol: rawSymbol2,
    })

    expect(parsedSymbol2.exchangeId).to.be.eq(Huobi.ID)
    expect(parsedSymbol2.id).to.be.eq(rawSymbol2.bc)
    expect(parsedSymbol2.alias).to.be.eq(undefined)

  })

  it('should parse many Huobi symbols just fine', async () => {

    const parseMock = ImportMock.mockFunction(
      HuobiSymbolModule,
      'parse',
    )

    each(HUOBI_PARSED_SYMBOLS, (parsed, i) => {

      parseMock.onCall(i).returns({ symbol: parsed, requestCount: 1 })

    })

    const { symbols: parsedSymbols } = HuobiSymbolModule.parseMany({
      rawSymbols: HUOBI_RAW_SYMBOLS,
    })

    expect(parsedSymbols).to.deep.eq(HUOBI_PARSED_SYMBOLS)

    expect(parseMock.callCount).to.be.eq(4)

  })

})
