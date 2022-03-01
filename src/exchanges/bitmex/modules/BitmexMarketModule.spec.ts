import { expect } from 'chai'
import {
  each,
  map,
} from 'lodash'
import { ImportMock } from 'ts-mock-imports'

import { mockPublicHttpRequest } from '../../../../test/helpers/http'
import { BitmexHttp } from '../BitmexHttp'
import { BitmexMarketParser } from '../schemas/parsers/BitmexMarketParser'
import { BITMEX_PARSED_MARKETS } from '../test/bitmexMarkets'
import { BITMEX_RAW_SYMBOLS } from '../test/bitmexSymbols'
import { BitmexMarketModule } from './BitmexMarketModule'
import { BitmexSymbolModule } from './BitmexSymbolModule'



describe('BitmexMarketModule', () => {

  it('should list Bitmex raw markets just fine', async () => {

    const bitmexSymbolModuleMock = ImportMock.mockFunction(
      BitmexSymbolModule,
      'listRaw',
      Promise.resolve(BITMEX_RAW_SYMBOLS),
    )

    const rawMarkets = await BitmexMarketModule.listRaw()

    expect(bitmexSymbolModuleMock.callCount).to.be.eq(1)

    expect(rawMarkets).to.be.eq(BITMEX_RAW_SYMBOLS)

  })

  it('should list Bitmex parsed markets just fine', async () => {

    const listRawMock = ImportMock.mockFunction(
      BitmexMarketModule,
      'listRaw',
      BITMEX_RAW_SYMBOLS,
    )

    const parseManyMock = ImportMock.mockFunction(
      BitmexMarketModule,
      'parseMany',
      BITMEX_PARSED_MARKETS,
    )

    const parsedMarkets = await BitmexMarketModule.list()

    expect(parsedMarkets).to.be.eq(BITMEX_PARSED_MARKETS)

    expect(listRawMock.callCount).to.be.eq(1)

    expect(parseManyMock.callCount).to.be.eq(1)
    expect(parseManyMock.args[0][0]).to.deep.eq({
      rawMarkets: BITMEX_RAW_SYMBOLS,
    })

  })

  it('should get a Bitmex raw market just fine', async () => {

    const { requestMock } = mockPublicHttpRequest({
      exchangeHttp: BitmexHttp,
    })

    const promises = map(BITMEX_RAW_SYMBOLS, async (rawMarket, i) => {

      requestMock.onCall(i).returns([rawMarket])

      const returned = await BitmexMarketModule.getRaw!({
        symbolPair: rawMarket.symbol,
      })

      expect(returned).to.deep.eq(rawMarket)

    })

    await Promise.all(promises)

  })

  it('should get a Bitmex parsed market just fine', async () => {

    const symbolPair = 'XBTUSD'

    const rawMarket = BITMEX_RAW_SYMBOLS[0]
    const parsedMarket = BITMEX_PARSED_MARKETS[0]

    const getRawMock = ImportMock.mockFunction(
      BitmexMarketModule,
      'getRaw',
      Promise.resolve(rawMarket),
    )

    const parseMock = ImportMock.mockFunction(
      BitmexMarketModule,
      'parse',
      parsedMarket,
    )

    const result = await BitmexMarketModule.get!({
      symbolPair,
    })

    expect(result).to.be.eq(parsedMarket)

    expect(getRawMock.args[0][0]).to.deep.eq({ symbolPair })
    expect(getRawMock.callCount).to.be.eq(1)

    expect(parseMock.args[0][0]).to.deep.eq({ rawMarket })
    expect(parseMock.callCount).to.be.eq(1)

  })

  it('should parse a Bitmex raw market just fine', () => {

    const bitmexMarketParserMock = ImportMock.mockFunction(
      BitmexMarketParser,
      'parse',
    )

    each(BITMEX_PARSED_MARKETS, (market, i) => {

      bitmexMarketParserMock.onCall(i).returns(market)

    })

    each(BITMEX_RAW_SYMBOLS, (rawMarket, i) => {

      const parsedMarket = BitmexMarketModule.parse({
        rawMarket,
      })

      expect(bitmexMarketParserMock.args[i][0]).to.deep.eq({
        rawMarket,
      })
      expect(bitmexMarketParserMock.returned(parsedMarket)).to.be.ok

    })

  })

  it('should parse many Bitmex raw markets just fine', () => {

    const parseMock = ImportMock.mockFunction(
      BitmexMarketModule,
      'parse',
    )

    each(BITMEX_PARSED_MARKETS, (rawMarket, i) => {

      parseMock.onCall(i).returns(rawMarket)

    })

    const parsedMarkets = BitmexMarketModule.parseMany({
      rawMarkets: BITMEX_RAW_SYMBOLS,
    })

    expect(parseMock.callCount).to.deep.eq(BITMEX_PARSED_MARKETS.length)

    expect(parsedMarkets).to.deep.eq(BITMEX_PARSED_MARKETS)

  })

})
