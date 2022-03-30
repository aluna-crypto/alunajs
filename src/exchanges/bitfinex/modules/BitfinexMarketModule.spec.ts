import { expect } from 'chai'
import { ImportMock } from 'ts-mock-imports'

import { BitfinexHttp } from '../BitfinexHttp'
import {
  BitfinexMarketParser,
  IBitfinexMarketParseParams,
} from '../schemas/parsers/BitfinexMarketParser'
import {
  BITFINEX_MARGIN_ENABLED_CURRENCIES,
  BITFINEX_PARSED_MARKETS,
  BITFINEX_RAW_MARKETS,
  BITFINEX_RAW_TICKERS,
} from '../test/fixtures/bitfinexMarkets'
import { BitfinexMarketModule } from './BitfinexMarketModule'



describe('BitfinexMarketModule', () => {

  it('should list Bitfinex raw markets just fine', async () => {

    const requestMock = ImportMock.mockFunction(
      BitfinexHttp,
      'publicRequest',
    )

    requestMock.onFirstCall().returns(Promise.resolve({
      data: BITFINEX_RAW_TICKERS,
      apiRequestCount: 1,
    }))
    requestMock.onSecondCall().returns(Promise.resolve({
      data: [
        BITFINEX_MARGIN_ENABLED_CURRENCIES,
      ],
      apiRequestCount: 1,
    }))

    const { rawMarkets } = await BitfinexMarketModule.listRaw()

    expect(rawMarkets.length).to.eq(2)

    expect(rawMarkets).to.deep.eq([
      BITFINEX_RAW_TICKERS,
      BITFINEX_MARGIN_ENABLED_CURRENCIES,
    ])

    expect(requestMock.calledWithExactly({
      url: 'https://api-pub.bitfinex.com/v2/tickers?symbols=ALL',
    }))

    const secondCallUrl = 'https://api-pub.bitfinex.com/v2/conf/'
      .concat('pub:list:pair:margin')

    expect(requestMock.calledWithExactly({
      url: secondCallUrl,
    }))

    expect(requestMock.callCount).to.be.eq(2)

  })

  it('should parse Bitfinex raw market just fine', async () => {

    const BitfinexMarketParserMock = ImportMock.mockFunction(
      BitfinexMarketParser,
      'parse',
      BITFINEX_PARSED_MARKETS[0],
    )

    // creating dicitonaries to call 'parse' method
    const enabledMarginMarketsDict: Record<string, string> = {}

    BITFINEX_MARGIN_ENABLED_CURRENCIES.forEach((c) => {

      enabledMarginMarketsDict[c[0]] = c

    })

    const rawMarket: IBitfinexMarketParseParams = {
      enabledMarginMarketsDict,
      rawTicker: BITFINEX_RAW_TICKERS[0],
    }

    const { market: parsedMarket1 } = BitfinexMarketModule.parse({ rawMarket })

    expect(BitfinexMarketParserMock.callCount).to.be.eq(1)

    expect(BitfinexMarketParserMock.calledWithExactly({
      rawTicker: BITFINEX_RAW_TICKERS[0],
      enabledMarginMarketsDict,
    })).to.be.ok

    expect(BitfinexMarketParserMock.returned(parsedMarket1)).to.be.ok

    // new mock
    BitfinexMarketParserMock.returns(BITFINEX_PARSED_MARKETS[1])

    const { market: parsedMarket2 } = BitfinexMarketModule.parse({
      rawMarket: {
        ...rawMarket,
        rawTicker: BITFINEX_RAW_TICKERS[1],
      },
    })

    expect(BitfinexMarketParserMock.callCount).to.be.eq(2)

    expect(BitfinexMarketParserMock.calledWithExactly({
      rawTicker: BITFINEX_RAW_TICKERS[1],
      enabledMarginMarketsDict,
    })).to.be.ok

    expect(BitfinexMarketParserMock.returned(parsedMarket2)).to.be.ok

  })

  it('should parse many Bitfinex raw markets just fine', async () => {

    const BitfinexMarketParserMock = ImportMock.mockFunction(
      BitfinexMarketModule,
      'parse',
    )

    // mocking 'parse' method calls
    BITFINEX_PARSED_MARKETS.forEach((parsed, i) => {

      BitfinexMarketParserMock.onCall(i).returns({
        market: parsed,
        apiRequestCount: 1,
      })

    })

    const { markets: parsedMarkets } = BitfinexMarketModule.parseMany({
      rawMarkets: BITFINEX_RAW_MARKETS,
    })

    expect(BitfinexMarketParserMock.callCount).to.be.eq(parsedMarkets.length)
    expect(BITFINEX_PARSED_MARKETS).to.deep.eq(parsedMarkets)

  })

  it('should list Bitfinex parsed markets just fine', async () => {

    const listRawMock = ImportMock.mockFunction(
      BitfinexMarketModule,
      'listRaw',
      {
        rawMarkets: BITFINEX_RAW_MARKETS,
        apiRequestCount: 1,
      },
    )

    const parseManyMock = ImportMock.mockFunction(
      BitfinexMarketModule,
      'parseMany',
      {
        markets: BITFINEX_PARSED_MARKETS,
        apiRequestCount: 1,
      },
    )

    const { markets: parsedMarkets } = await BitfinexMarketModule.list()

    expect(listRawMock.callCount).to.be.eq(1)
    expect(parseManyMock.callCount).to.be.eq(1)

    expect(parseManyMock.calledWithExactly({
      rawMarkets: BITFINEX_RAW_MARKETS,
    })).to.be.ok

    expect(parseManyMock.returned({
      markets: parsedMarkets,
      apiRequestCount: 1,
    })).to.be.ok

  })

})
