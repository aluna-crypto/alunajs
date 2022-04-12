import { expect } from 'chai'
import { each } from 'lodash'
import { ImportMock } from 'ts-mock-imports'

import { mockPublicHttpRequest } from '../../../../test/helpers/http/axios'
import { mockAlunaSymbolMapping } from '../../../utils/mappings/AlunaSymbolMapping.mock'
import { BitmexHttp } from '../BitmexHttp'
import {
  BitmexSpecs,
  PROD_BITMEX_URL,
} from '../BitmexSpecs'
import { IBitmexSymbolsSchema } from '../schemas/IBitmexSymbolsSchema'
import {
  BITMEX_PARSED_SYMBOLS,
  BITMEX_RAW_SYMBOLS,
} from '../test/bitmexSymbols'
import { BitmexSymbolModule } from './BitmexSymbolModule'



describe('BitmexSymbolModule', () => {

  it('should list Bitmex raw symbols just fine', async () => {

    const { requestMock } = mockPublicHttpRequest({
      exchangeHttp: BitmexHttp,
      requestResponse: BITMEX_RAW_SYMBOLS,
    })

    const { rawSymbols } = await BitmexSymbolModule.listRaw()

    expect(requestMock.callCount).to.be.eq(1)
    expect(requestMock.args[0][0]).to.deep.eq({
      url: `${PROD_BITMEX_URL}/instrument/active`,
    })

    expect(rawSymbols).to.be.eq(BITMEX_RAW_SYMBOLS)

  })

  it('should list Bitmex parsed symbols just fine', async () => {

    const listRawMock = ImportMock.mockFunction(
      BitmexSymbolModule,
      'listRaw',
      {
        rawSymbols: BITMEX_RAW_SYMBOLS,
        requestCount: 1,
      },
    )

    const parseManyMock = ImportMock.mockFunction(
      BitmexSymbolModule,
      'parseMany',
      {
        symbols: BITMEX_PARSED_SYMBOLS,
        requestCount: 1,
      },
    )

    const { symbols: parsedSymbols } = await BitmexSymbolModule.list()

    expect(parsedSymbols).to.be.eq(BITMEX_PARSED_SYMBOLS)

    expect(listRawMock.callCount).to.be.eq(1)

    expect(parseManyMock.callCount).to.be.eq(1)
    expect(parseManyMock.args[0][0]).to.deep.eq({
      rawSymbols: BITMEX_RAW_SYMBOLS,
    })

  })

  it('should parse a Bitmex raw symbol just fine', () => {

    const translatedSymbolId = 'BTC'

    const { alunaSymbolMappingMock } = mockAlunaSymbolMapping({
      returnSymbol: translatedSymbolId,
    })

    const rawSymbol1 = {
      symbol: 'XBTUSD',
      rootSymbol: 'XBT',
      quoteCurrency: 'USD',
      askPrice: 0,
    } as IBitmexSymbolsSchema


    const { symbol: parsedSymbol1 } = BitmexSymbolModule.parse({
      rawSymbol: rawSymbol1,
    })

    expect(parsedSymbol1.exchangeId).to.be.eq(BitmexSpecs.id)
    expect(parsedSymbol1.id).to.be.eq(translatedSymbolId)
    expect(parsedSymbol1.alias).to.be.eq(rawSymbol1.rootSymbol)
    expect(parsedSymbol1.meta).to.be.eq(rawSymbol1)

    expect(alunaSymbolMappingMock.callCount).to.be.eq(1)
    expect(alunaSymbolMappingMock.args[0][0]).to.deep.eq({
      exchangeSymbolId: rawSymbol1.rootSymbol,
      symbolMappings: {},
    })

    const rawSymbol2 = {
      symbol: 'ADAUSDT',
      rootSymbol: 'ADA',
      quoteCurrency: 'USDT',
      askPrice: 0,
    } as IBitmexSymbolsSchema


    const { symbol: parsedSymbol2 } = BitmexSymbolModule.parse({
      rawSymbol: rawSymbol2,
    })

    expect(parsedSymbol2.exchangeId).to.be.eq(BitmexSpecs.id)
    expect(parsedSymbol2.id).to.be.eq(translatedSymbolId)
    expect(parsedSymbol2.alias).to.be.eq(rawSymbol2.rootSymbol)
    expect(parsedSymbol2.meta).to.be.eq(rawSymbol2)

    expect(alunaSymbolMappingMock.callCount).to.be.eq(2)
    expect(alunaSymbolMappingMock.args[1][0]).to.deep.eq({
      exchangeSymbolId: rawSymbol2.rootSymbol,
      symbolMappings: {},
    })

    const rawSymbol3 = {
      symbol: 'LTCEUR',
      rootSymbol: 'LTC',
      quoteCurrency: 'EUR',
      askPrice: 0,
    } as IBitmexSymbolsSchema

    alunaSymbolMappingMock.returns(rawSymbol3.rootSymbol)


    const { symbol: parsedSymbol3 } = BitmexSymbolModule.parse({
      rawSymbol: rawSymbol3,
    })

    expect(parsedSymbol3.exchangeId).to.be.eq(BitmexSpecs.id)
    expect(parsedSymbol3.id).to.be.eq(rawSymbol3.rootSymbol)
    expect(parsedSymbol3.alias).not.to.be.ok
    expect(parsedSymbol3.meta).to.be.eq(rawSymbol3)

    expect(alunaSymbolMappingMock.callCount).to.be.eq(3)
    expect(alunaSymbolMappingMock.args[2][0]).to.deep.eq({
      exchangeSymbolId: rawSymbol3.rootSymbol,
      symbolMappings: {},
    })


  })

  it('should parse many Bitmex raw symbols just fine', () => {

    const parseMock = ImportMock.mockFunction(
      BitmexSymbolModule,
      'parse',
    )

    each(BITMEX_PARSED_SYMBOLS, (rawSymbol, i) => {

      parseMock.onCall(i).returns({
        symbol: rawSymbol,
        requestCount: 1,
      })

    })


    const { symbols: parsedSymbols } = BitmexSymbolModule.parseMany({
      rawSymbols: BITMEX_RAW_SYMBOLS,
    })

    expect(parseMock.callCount).to.deep.eq(BITMEX_PARSED_SYMBOLS.length)
    expect(parsedSymbols).to.deep.eq(BITMEX_PARSED_SYMBOLS)

  })

})
