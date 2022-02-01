import { expect } from 'chai'
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
      Promise.resolve(BINANCE_RAW_SYMBOLS),
    )

    const rawSymbols = await BinanceSymbolModule.listRaw()

    expect(rawSymbols.length).to.eq(3)
    expect(rawSymbols).to.deep.eq(BINANCE_RAW_SYMBOLS.symbols)

    for (let index = 0; index < 3; index += 1) {

      expect(rawSymbols[index].symbol)
        .to.be.eq(BINANCE_RAW_SYMBOLS.symbols[index].symbol)
      expect(rawSymbols[index].baseAsset)
        .to.be.eq(BINANCE_RAW_SYMBOLS.symbols[index].baseAsset)
      expect(rawSymbols[index].quoteAsset)
        .to.be.eq(BINANCE_RAW_SYMBOLS.symbols[index].quoteAsset)

    }

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

    expect(rawSymbols.length).to.eq(3)
    expect(rawSymbols).to.deep.eq(BINANCE_PARSED_SYMBOLS)

    for (let index = 0; index < 3; index += 1) {

      expect(rawSymbols[index].exchangeId).to.be.eq(Binance.ID)
      expect(rawSymbols[index].id).to.be.eq(BINANCE_PARSED_SYMBOLS[index].id)

    }

    expect(listRawMock.callCount).to.eq(1)

    expect(parseManyMock.callCount).to.eq(1)
    expect(parseManyMock.calledWith({
      rawSymbols: BINANCE_RAW_SYMBOLS,
    })).to.be.ok

  })



  it('should parse a Binance symbol just fine', async () => {

    const parsedSymbol1 = BinanceSymbolModule.parse({
      rawSymbol: BINANCE_RAW_SYMBOLS.symbols[1],
    })

    expect(parsedSymbol1.exchangeId).to.be.eq(Binance.ID)
    expect(parsedSymbol1.id).to.be.eq(BINANCE_RAW_SYMBOLS.symbols[1].baseAsset)

    const parsedSymbol2 = BinanceSymbolModule.parse({
      rawSymbol: BINANCE_RAW_SYMBOLS.symbols[2],
    })

    expect(parsedSymbol2.exchangeId).to.be.eq(Binance.ID)
    expect(parsedSymbol2.id).to.be.eq(BINANCE_RAW_SYMBOLS.symbols[2].baseAsset)

  })



  it('should parse many Binance symbols just fine', async () => {

    const parseMock = ImportMock.mockFunction(
      BinanceSymbolModule,
      'parse',
    )

    const rawSymbol = BINANCE_RAW_SYMBOLS.symbols[0]

    parseMock
      .onFirstCall()
      .returns(BINANCE_PARSED_SYMBOLS[0])
      .onSecondCall()
      .returns(BINANCE_PARSED_SYMBOLS[1])
      .onThirdCall()
      .returns(BINANCE_PARSED_SYMBOLS[2])

    const parsedSymbols = BinanceSymbolModule.parseMany({
      rawSymbols: [rawSymbol, rawSymbol, rawSymbol],
    })

    for (let index = 0; index < 3; index += 1) {

      expect(parsedSymbols[index].exchangeId).to.be.eq(Binance.ID)
      expect(parsedSymbols[index].id).to.be.eq(BINANCE_PARSED_SYMBOLS[index].id)

    }

    expect(parseMock.callCount).to.be.eq(3)
    expect(parseMock.calledWith({ rawSymbol }))

  })

})
