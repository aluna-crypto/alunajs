import { expect } from 'chai'
import { each } from 'lodash'
import { ImportMock } from 'ts-mock-imports'

import { Ftx } from '../Ftx'
import { IFtxMarketSchema } from '../schemas/IFtxMarketSchema'
import { FTX_RAW_MARKETS } from '../test/fixtures/ftxMarket'
import { FTX_PARSED_SYMBOLS } from '../test/fixtures/ftxSymbol'
import { FtxMarketModule } from './FtxMarketModule'
import { FtxSymbolModule } from './FtxSymbolModule'



describe('FtxSymbolModule', () => {


  it('should list Ftx raw symbols just fine', async () => {

    const listRawMarketsMock = ImportMock.mockFunction(
      FtxMarketModule,
      'listRaw',
      FTX_RAW_MARKETS,
    )

    const rawSymbols = await FtxSymbolModule.listRaw()

    expect(rawSymbols.length).to.eq(3)
    expect(rawSymbols).to.deep.eq(FTX_RAW_MARKETS)

    expect(listRawMarketsMock.callCount).to.be.eq(1)

  })



  it('should list Ftx parsed symbols just fine', async () => {

    const listRawMock = ImportMock.mockFunction(
      FtxSymbolModule,
      'listRaw',
      Promise.resolve(FTX_RAW_MARKETS),
    )

    const parseManyMock = ImportMock.mockFunction(
      FtxSymbolModule,
      'parseMany',
      FTX_PARSED_SYMBOLS,
    )


    const rawSymbols = await FtxSymbolModule.list()

    expect(rawSymbols.length).to.eq(4)
    expect(rawSymbols).to.deep.eq(FTX_PARSED_SYMBOLS)

    expect(listRawMock.callCount).to.eq(1)

    expect(parseManyMock.callCount).to.eq(1)
    expect(parseManyMock.calledWith({
      rawSymbols: FTX_RAW_MARKETS,
    })).to.be.ok

  })



  it('should parse a Ftx symbol just fine', async () => {

    const parsedSymbol1 = FtxSymbolModule.parse({
      rawSymbol: FTX_RAW_MARKETS[1],
    })

    expect(parsedSymbol1.exchangeId).to.be.eq(Ftx.ID)
    expect(parsedSymbol1.id).to.be.eq(FTX_RAW_MARKETS[1].baseCurrency)

    const parsedSymbol2 = FtxSymbolModule.parse({
      rawSymbol: FTX_RAW_MARKETS[2],
    })

    expect(parsedSymbol2.exchangeId).to.be.eq(Ftx.ID)
    expect(parsedSymbol2.id).to.be.eq(FTX_RAW_MARKETS[2].baseCurrency)

  })



  it('should parse many Ftx symbols just fine', async () => {

    const additionalRawMarket: IFtxMarketSchema = {
      ...FTX_RAW_MARKETS[0],
      baseCurrency: 'USD',
    }

    const rawMarkets = [...FTX_RAW_MARKETS, additionalRawMarket]

    const parseMock = ImportMock.mockFunction(
      FtxSymbolModule,
      'parse',
    )

    each(FTX_PARSED_SYMBOLS, (parsed, i) => {

      parseMock.onCall(i).returns(parsed)

    })

    const parsedSymbols = FtxSymbolModule.parseMany({
      rawSymbols: rawMarkets,
    })

    expect(parsedSymbols).to.deep.eq(FTX_PARSED_SYMBOLS)

    expect(parseMock.callCount).to.be.eq(4)

  })

})
