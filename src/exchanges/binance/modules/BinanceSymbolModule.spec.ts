import { expect } from 'chai'
import { each } from 'lodash'
import { ImportMock } from 'ts-mock-imports'

import { Binance } from '../Binance'
import { BinanceHttp } from '../BinanceHttp'
import {
  BINANCE_PARSED_SYMBOLS,
  BINANCE_RAW_SYMBOLS,
} from '../test/fixtures/binanceSymbols'
import { BinanceSymbolModule } from './BinanceSymbolModule'



describe('BinanceSymbolModule', () => {


  it('should list Binance raw symbols just fine', async () => {

    const requestMock = ImportMock.mockFunction(
      BinanceHttp,
      'publicRequest',
      Promise.resolve({ symbols: BINANCE_RAW_SYMBOLS }),
    )

    const rawSymbols = await BinanceSymbolModule.listRaw()

    expect(rawSymbols.length).to.eq(4)
    expect(rawSymbols).to.deep.eq(BINANCE_RAW_SYMBOLS)

    expect(requestMock.callCount).to.be.eq(1)

  })



  it('should list Binance parsed symbols just fine', async () => {

    const listRawMock = ImportMock.mockFunction(
      BinanceSymbolModule,
      'listRaw',
      Promise.resolve(BINANCE_RAW_SYMBOLS),
    )

    const parseManyMock = ImportMock.mockFunction(
      BinanceSymbolModule,
      'parseMany',
      BINANCE_PARSED_SYMBOLS,
    )


    const rawSymbols = await BinanceSymbolModule.list()

    expect(rawSymbols.length).to.eq(5)
    expect(rawSymbols).to.deep.eq(BINANCE_PARSED_SYMBOLS)

    expect(listRawMock.callCount).to.eq(1)

    expect(parseManyMock.callCount).to.eq(1)
    expect(parseManyMock.calledWith({
      rawSymbols: BINANCE_RAW_SYMBOLS,
    })).to.be.ok

  })



  it('should parse a Binance symbol just fine', async () => {

    const parsedSymbol1 = BinanceSymbolModule.parse({
      rawSymbol: BINANCE_RAW_SYMBOLS[1],
    })

    expect(parsedSymbol1.exchangeId).to.be.eq(Binance.ID)
    expect(parsedSymbol1.id).to.be.eq(BINANCE_RAW_SYMBOLS[1].baseAsset)

    const parsedSymbol2 = BinanceSymbolModule.parse({
      rawSymbol: BINANCE_RAW_SYMBOLS[2],
    })

    expect(parsedSymbol2.exchangeId).to.be.eq(Binance.ID)
    expect(parsedSymbol2.id).to.be.eq(BINANCE_RAW_SYMBOLS[2].baseAsset)

  })



  it('should parse many Binance symbols just fine', async () => {

    const parseMock = ImportMock.mockFunction(
      BinanceSymbolModule,
      'parse',
    )

    each(BINANCE_PARSED_SYMBOLS, (parsed, i) => {

      parseMock.onCall(i).returns(parsed)

    })

    const parsedSymbols = BinanceSymbolModule.parseMany({
      rawSymbols: BINANCE_RAW_SYMBOLS,
    })

    expect(parsedSymbols).to.deep.eq(BINANCE_PARSED_SYMBOLS)

    expect(parseMock.callCount).to.be.eq(5)

  })

})
