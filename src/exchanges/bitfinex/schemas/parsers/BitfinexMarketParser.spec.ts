import { expect } from 'chai'

import { Bitfinex } from '../../Bitfinex'
import {
  BITFINEX_MARGIN_ENABLED_CURRENCIES,
  BITFINEX_RAW_TICKERS,
} from '../../test/fixtures/bitfinexMarkets'
import { BITFINEX_CURRENCIES_SYMS } from '../../test/fixtures/bitfinexSymbols'
import { TBitfinexCurrencySym } from '../IBitfinexSymbolSchema'
import { BitfinexMarketParser } from './BitfinexMarketParser'



describe('BitfinexMarketParser', () => {

  it('should parse Bitfinex raw market just fine', async () => {

    const currencySymsDict: Record<string, TBitfinexCurrencySym> = {}
    const enabledMarginMarketsDict: Record<string, string> = {}

    BITFINEX_CURRENCIES_SYMS.forEach((s) => {

      currencySymsDict[s[0]] = s

    })

    BITFINEX_MARGIN_ENABLED_CURRENCIES.forEach((c) => {

      enabledMarginMarketsDict[c[0]] = c

    })

    BITFINEX_RAW_TICKERS.forEach((rawTicker) => {

      const parsedMarket = BitfinexMarketParser.parse({
        rawTicker,
        currencySymsDict,
        enabledMarginMarketsDict,
      })

      const symbol = rawTicker[0]

      let baseSymbolId: string
      let quoteSymbolId: string

      const spliter = symbol.indexOf(':')

      if (spliter >= 0) {

        baseSymbolId = symbol.slice(1, spliter)
        quoteSymbolId = symbol.slice(spliter + 1)

      } else {

        baseSymbolId = symbol.slice(1, 4)
        quoteSymbolId = symbol.slice(4)

      }

      baseSymbolId = currencySymsDict[baseSymbolId]
        ? currencySymsDict[baseSymbolId][1].toUpperCase()
        : baseSymbolId

      quoteSymbolId = currencySymsDict[quoteSymbolId]
        ? currencySymsDict[quoteSymbolId][1].toUpperCase()
        : quoteSymbolId

      const isMarginEnabled = !!enabledMarginMarketsDict[rawTicker[0].slice(1)]

      expect(parsedMarket.exchangeId).to.be.eq(Bitfinex.ID)

      expect(parsedMarket.symbolPair).to.be.eq(rawTicker[0])
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

    })

  })

})
