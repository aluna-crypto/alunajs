import { expect } from 'chai'
import Sinon from 'sinon'
import { ImportMock } from 'ts-mock-imports'

import { AlunaSymbolMapping } from '../../../../utils/mappings/AlunaSymbolMapping'
import { Bitfinex } from '../../Bitfinex'
import {
  BITFINEX_MARGIN_ENABLED_CURRENCIES,
  BITFINEX_RAW_TICKERS,
} from '../../test/fixtures/bitfinexMarkets'
import { BitfinexMarketParser } from './BitfinexMarketParser'
import { BitfinexSymbolParser } from './BitfinexSymbolParser'



describe('BitfinexMarketParser', () => {

  afterEach(Sinon.restore)

  it('should parse Bitfinex raw market just fine', async () => {

    let mappings: Record<string, string> | undefined

    const bitfinexSettingsMock = ImportMock.mockOther(
      Bitfinex,
      'settings',
    )

    const translateSymbolIdSpy = Sinon.spy(
      (params: any) => {

        const {
          symbolMappings = {},
          exchangeSymbolId,
        } = params

        return symbolMappings[params.exchangeSymbolId] || exchangeSymbolId

      },
    )

    ImportMock.mockOther(
      AlunaSymbolMapping,
      'translateSymbolId',
      translateSymbolIdSpy,
    )

    const mockedBaseSymbolId = 'BTC'
    const mockedQuoteSymbolId = 'UST'

    const splitSymbolPairMock = ImportMock.mockFunction(
      BitfinexSymbolParser,
      'splitSymbolPair',
      {
        baseSymbolId: mockedBaseSymbolId,
        quoteSymbolId: mockedQuoteSymbolId,
      },
    )

    const enabledMarginMarketsDict: Record<string, string> = {}

    BITFINEX_MARGIN_ENABLED_CURRENCIES.forEach((c) => {

      enabledMarginMarketsDict[c[0]] = c

    })

    BITFINEX_RAW_TICKERS.forEach((rawTicker, index) => {

      if (index % 2 === 0) {

        mappings = { UST: 'USDT' }

        bitfinexSettingsMock.set({ mappings })

      } else if (index % 3 === 0) {

        mappings = {}

        bitfinexSettingsMock.set({})

      } else {

        mappings = {}

        bitfinexSettingsMock.set(undefined)

      }

      const parsedMarket = BitfinexMarketParser.parse({
        rawTicker,
        enabledMarginMarketsDict,
      })

      const symbol = rawTicker[0]

      const baseSymbolId = mappings[mockedBaseSymbolId] || mockedBaseSymbolId
      const quoteSymbolId = mappings[mockedQuoteSymbolId] || mockedQuoteSymbolId

      const isMarginEnabled = !!enabledMarginMarketsDict[rawTicker[0].slice(1)]

      expect(parsedMarket.exchangeId).to.be.eq(Bitfinex.ID)

      expect(parsedMarket.symbolPair).to.be.eq(symbol)
      expect(parsedMarket.baseSymbolId).to.be.eq(baseSymbolId)
      expect(parsedMarket.quoteSymbolId).to.be.eq(quoteSymbolId)

      expect(parsedMarket.spotEnabled).to.be.ok
      expect(parsedMarket.marginEnabled).to.be.eq(isMarginEnabled)
      expect(parsedMarket.derivativesEnabled).not.to.be.ok

      const { ticker } = parsedMarket

      expect(ticker.bid).to.be.eq(rawTicker[1])
      expect(ticker.ask).to.be.eq(rawTicker[3])
      expect(ticker.change).to.be.eq(rawTicker[6])
      expect(ticker.last).to.be.eq(rawTicker[7])
      expect(ticker.baseVolume).to.be.eq(rawTicker[8])
      expect(ticker.quoteVolume).to.be.eq(rawTicker[8] * rawTicker[1])
      expect(ticker.high).to.be.eq(rawTicker[9])
      expect(ticker.low).to.be.eq(rawTicker[10])
      expect(ticker.date).to.be.ok

      expect(parsedMarket.meta).to.deep.eq(rawTicker)

      expect(parsedMarket.instrument).not.to.be.ok
      expect(parsedMarket.leverageEnabled).not.to.be.ok
      expect(parsedMarket.maxLeverage).not.to.be.ok

      expect(splitSymbolPairMock.callCount).to.be.eq(index + 1)

      const translateSymbolIdSpyCallCount = index === 0
        ? 2
        : (index + 1) * 2

      expect(translateSymbolIdSpy.callCount)
        .to.be.eq(translateSymbolIdSpyCallCount)

    })

  })

})
