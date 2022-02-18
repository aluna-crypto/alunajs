import { expect } from 'chai'
import { each } from 'lodash'
import { ImportMock } from 'ts-mock-imports'

import { BitmexHttp } from '../BitmexHttp'
import { BitmexSpecs } from '../BitmexSpecs'
import { IBitmexSymbolsSchema } from '../schemas/IBitmexSymbolsSchema'
import {
  BITMEX_PARSED_SYMBOLS,
  BITMEX_RAW_SYMBOLS,
} from '../test/bitmexSymbols'
import { BitmexSymbolModule } from './BitmexSymbolModule'



describe.only('BitmexSymbolModule', () => {

  it('should list Bitmex raw symbols just fine', async () => {

    const requestMock = ImportMock.mockFunction(
      BitmexHttp,
      'publicRequest',
      Promise.resolve(BITMEX_RAW_SYMBOLS),
    )

    const rawSymbols = await BitmexSymbolModule.listRaw()

    expect(requestMock.callCount).to.be.eq(1)
    expect(requestMock.args[0][0]).to.deep.eq({
      url: `${BitmexSpecs.connectApiUrl}/instrument/active`,
    })

    expect(rawSymbols).to.be.eq(BITMEX_RAW_SYMBOLS)

  })

  it('should parse many Bitmex raw symbols just fine', () => {

    const parseMock = ImportMock.mockFunction(
      BitmexSymbolModule,
      'parse',
    )

    each(BITMEX_PARSED_SYMBOLS, (rawSymbol, i) => {

      parseMock.onCall(i).returns(rawSymbol)

    })


    const parsedSymbols = BitmexSymbolModule.parseMany({
      rawSymbols: BITMEX_RAW_SYMBOLS,
    })

    expect(parseMock.callCount).to.deep.eq(BITMEX_PARSED_SYMBOLS.length)
    expect(parsedSymbols).to.deep.eq(BITMEX_PARSED_SYMBOLS)

  })

  it('should parse a Bitmex raw symbol just fine', () => {

    const rawSymbol1 = {
      symbol: 'XBTUSD',
      rootSymbol: 'XBT',
      quoteCurrency: 'USD',
      askPrice: 0,
    } as IBitmexSymbolsSchema


    const parsedSymbol1 = BitmexSymbolModule.parse({
      rawSymbol: rawSymbol1,
    })

    expect(parsedSymbol1.exchangeId).to.be.eq(BitmexSpecs.id)
    expect(parsedSymbol1.id).to.be.eq(rawSymbol1.rootSymbol)
    expect(parsedSymbol1.meta).to.be.eq(rawSymbol1)


    const rawSymbol2 = {
      symbol: 'ADAUSDT',
      rootSymbol: 'ADA',
      quoteCurrency: 'USDT',
      askPrice: 0,
    } as IBitmexSymbolsSchema


    const parsedSymbol2 = BitmexSymbolModule.parse({
      rawSymbol: rawSymbol2,
    })

    expect(parsedSymbol2.exchangeId).to.be.eq(BitmexSpecs.id)
    expect(parsedSymbol2.id).to.be.eq(rawSymbol2.rootSymbol)
    expect(parsedSymbol2.meta).to.be.eq(rawSymbol2)


    const rawSymbol3 = {
      symbol: 'LTCEUR',
      rootSymbol: 'LTC',
      quoteCurrency: 'EUR',
      askPrice: 0,
    } as IBitmexSymbolsSchema


    const parsedSymbol3 = BitmexSymbolModule.parse({
      rawSymbol: rawSymbol3,
    })

    expect(parsedSymbol3.exchangeId).to.be.eq(BitmexSpecs.id)
    expect(parsedSymbol3.id).to.be.eq(rawSymbol3.rootSymbol)
    expect(parsedSymbol3.meta).to.be.eq(rawSymbol3)

  })

})
