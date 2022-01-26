import { expect } from 'chai'
import { ImportMock } from 'ts-mock-imports'

import { BitfinexHttp } from '../BitfinexHttp'
import { TBitfinexCurrencySym } from '../schemas/IBitfinexSymbolSchema'
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
import { BITFINEX_CURRENCIES_SYMS } from '../test/fixtures/bitfinexSymbols'
import { BitfinexMarketModule } from './BitfinexMarketModule'



describe('BitfinexMarketModule', () => {

  it('should list Bitfinex raw markets just fine', async () => {

    const requestMock = ImportMock.mockFunction(
      BitfinexHttp,
      'publicRequest',
    )

    requestMock.onFirstCall().returns(Promise.resolve(BITFINEX_RAW_TICKERS))
    requestMock.onSecondCall().returns(Promise.resolve([
      BITFINEX_MARGIN_ENABLED_CURRENCIES,
      BITFINEX_CURRENCIES_SYMS,
    ]))

    const rawMarkets = await BitfinexMarketModule.listRaw()

    expect(rawMarkets.length).to.eq(3)

    expect(rawMarkets).to.deep.eq([
      BITFINEX_RAW_TICKERS,
      BITFINEX_MARGIN_ENABLED_CURRENCIES,
      BITFINEX_CURRENCIES_SYMS,
    ])

    expect(requestMock.calledWithExactly({
      url: 'https://api-pub.bitfinex.com/v2/tickers?symbols=ALL',
    }))

    const secondCallUrl = 'https://api-pub.bitfinex.com/v2/conf/'
      .concat('pub:list:pair:margin')
      .concat(',pub:map:currency:sym')

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
    const currencySymsDict: Record<string, TBitfinexCurrencySym> = {}
    const enabledMarginMarketsDict: Record<string, string> = {}

    BITFINEX_CURRENCIES_SYMS.forEach((s) => {

      currencySymsDict[s[0]] = s

    })

    BITFINEX_MARGIN_ENABLED_CURRENCIES.forEach((c) => {

      enabledMarginMarketsDict[c[0]] = c

    })

    const rawMarket: IBitfinexMarketParseParams = {
      currencySymsDict,
      enabledMarginMarketsDict,
      rawTicker: BITFINEX_RAW_TICKERS[0],
    }

    const parsedMarket1 = BitfinexMarketModule.parse({ rawMarket })

    expect(BitfinexMarketParserMock.callCount).to.be.eq(1)

    expect(BitfinexMarketParserMock.calledWithExactly({
      rawTicker: BITFINEX_RAW_TICKERS[0],
      currencySymsDict,
      enabledMarginMarketsDict,
    })).to.be.ok

    expect(BitfinexMarketParserMock.returned(parsedMarket1)).to.be.ok

    // new mock
    BitfinexMarketParserMock.returns(BITFINEX_PARSED_MARKETS[1])

    const parsedMarket2 = BitfinexMarketModule.parse({
      rawMarket: {
        ...rawMarket,
        rawTicker: BITFINEX_RAW_TICKERS[1],
      },
    })

    expect(BitfinexMarketParserMock.callCount).to.be.eq(2)

    expect(BitfinexMarketParserMock.calledWithExactly({
      rawTicker: BITFINEX_RAW_TICKERS[1],
      currencySymsDict,
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

      BitfinexMarketParserMock.onCall(i).returns(parsed)

    })

    const parsedMarkets = BitfinexMarketModule.parseMany({
      rawMarkets: BITFINEX_RAW_MARKETS,
    })

    expect(BitfinexMarketParserMock.callCount).to.be.eq(parsedMarkets.length)
    expect(BITFINEX_PARSED_MARKETS).to.deep.eq(parsedMarkets)

  })

})
