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

    expect(rawSymbols[0].symbol)
      .to.be.eq(BINANCE_RAW_SYMBOLS.symbols[0].symbol)
    expect(rawSymbols[0].baseAsset)
      .to.be.eq(BINANCE_RAW_SYMBOLS.symbols[0].baseAsset)
    expect(rawSymbols[0].quoteAsset)
      .to.be.eq(BINANCE_RAW_SYMBOLS.symbols[0].quoteAsset)

    expect(rawSymbols[1].symbol)
      .to.be.eq(BINANCE_RAW_SYMBOLS.symbols[1].symbol)
    expect(rawSymbols[1].baseAsset)
      .to.be.eq(BINANCE_RAW_SYMBOLS.symbols[1].baseAsset)
    expect(rawSymbols[1].quoteAsset)
      .to.be.eq(BINANCE_RAW_SYMBOLS.symbols[1].quoteAsset)

    expect(rawSymbols[2].symbol)
      .to.be.eq(BINANCE_RAW_SYMBOLS.symbols[2].symbol)
    expect(rawSymbols[2].baseAsset)
      .to.be.eq(BINANCE_RAW_SYMBOLS.symbols[2].baseAsset)
    expect(rawSymbols[2].quoteAsset)
      .to.be.eq(BINANCE_RAW_SYMBOLS.symbols[2].quoteAsset)

    expect(requestMock.callCount).to.be.eq(1)

  })



  it('should list Binance parsed symbols just fine', async () => {

    const mockedRawSymbols = 'raw-symbols'

    const listRawMock = ImportMock.mockFunction(
      BinanceSymbolModule,
      'listRaw',
      Promise.resolve(mockedRawSymbols),
    )

    const parseManyMock = ImportMock.mockFunction(
      BinanceSymbolModule,
      'parseMany',
      BINANCE_PARSED_SYMBOLS,
    )


    const rawSymbols = await BinanceSymbolModule.list()

    expect(rawSymbols.length).to.eq(3)
    expect(rawSymbols).to.deep.eq(BINANCE_PARSED_SYMBOLS)

    expect(rawSymbols[0].exchangeId).to.be.eq(Binance.ID)
    expect(rawSymbols[0].id).to.be.eq(BINANCE_PARSED_SYMBOLS[0].id)

    expect(rawSymbols[1].exchangeId).to.be.eq(Binance.ID)
    expect(rawSymbols[1].id).to.be.eq(BINANCE_PARSED_SYMBOLS[1].id)

    expect(rawSymbols[2].exchangeId).to.be.eq(Binance.ID)
    expect(rawSymbols[2].id).to.be.eq(BINANCE_PARSED_SYMBOLS[2].id)

    expect(listRawMock.callCount).to.eq(1)

    expect(parseManyMock.callCount).to.eq(1)
    expect(parseManyMock.calledWith({
      rawSymbols: mockedRawSymbols,
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

    const rawSymbol = {}

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

    expect(parsedSymbols[0].exchangeId).to.be.eq(Binance.ID)
    expect(parsedSymbols[0].id).to.be.eq(BINANCE_PARSED_SYMBOLS[0].id)

    expect(parsedSymbols[1].exchangeId).to.be.eq(Binance.ID)
    expect(parsedSymbols[1].id).to.be.eq(BINANCE_PARSED_SYMBOLS[1].id)

    expect(parsedSymbols[2].exchangeId).to.be.eq(Binance.ID)
    expect(parsedSymbols[2].id).to.be.eq(BINANCE_PARSED_SYMBOLS[2].id)

    expect(parseMock.callCount).to.be.eq(3)
    expect(parseMock.calledWith({ rawSymbol }))

  })

})
