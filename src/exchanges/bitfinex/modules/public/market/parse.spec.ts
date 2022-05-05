import { expect } from 'chai'
import { find } from 'lodash'

import { mockTranslateSymbolId } from '../../../../../utils/mappings/translateSymbolId.mock'
import { Bitfinex } from '../../../Bitfinex'
import { bitfinexBaseSpecs } from '../../../bitfinexSpecs'
import { IBitfinexMarketSchema } from '../../../schemas/IBitfinexMarketSchema'
import {
  BITFINEX_MARGIN_ENABLED_CURRENCIES,
  BITFINEX_RAW_TICKERS,
} from '../../../test/fixtures/bitfinexMarket'



describe(__filename, () => {

  it(
    "should parse a Bitfinex raw market just fine (symbol w/ ':')",
    async () => {

      // preparing data
      const translatedSymbolId1 = 'BTC'
      const translatedSymbolId2 = 'ETH'

      const tickers = BITFINEX_RAW_TICKERS
      const enabledMargin = BITFINEX_MARGIN_ENABLED_CURRENCIES

      const ticker = find(tickers, ([symbol]) => symbol.indexOf(':') >= 0)!

      const enabledMarginCurrency = find(enabledMargin[0], ticker[0])

      const rawMarket: IBitfinexMarketSchema = {
        enabledMarginCurrency,
        ticker,
      }


      // mocking
      const { translateSymbolId } = mockTranslateSymbolId()
      translateSymbolId.onFirstCall().returns(translatedSymbolId1)
      translateSymbolId.onSecondCall().returns(translatedSymbolId2)


      // executing
      const exchange = new Bitfinex({})

      const { market } = exchange.market.parse({
        rawMarket,
      })


      // validating
      expect(market.exchangeId).to.be.eq(bitfinexBaseSpecs.id)

      expect(market.symbolPair).to.be.eq(ticker[0])
      expect(market.baseSymbolId).to.be.eq(translatedSymbolId1)
      expect(market.quoteSymbolId).to.be.eq(translatedSymbolId2)

      expect(market.spotEnabled).to.be.ok
      expect(market.marginEnabled).to.be.eq(!!enabledMarginCurrency)
      expect(market.derivativesEnabled).not.to.be.ok

      expect(market.ticker.bid).to.be.eq(ticker[1])
      expect(market.ticker.ask).to.be.eq(ticker[3])
      expect(market.ticker.change).to.be.eq(ticker[6])
      expect(market.ticker.last).to.be.eq(ticker[7])
      expect(market.ticker.baseVolume).to.be.eq(ticker[8])
      expect(market.ticker.quoteVolume).to.be.eq(ticker[8] * ticker[1])
      expect(market.ticker.high).to.be.eq(ticker[9])
      expect(market.ticker.low).to.be.eq(ticker[10])
      expect(market.ticker.date).to.be.ok

      expect(market.meta).to.deep.eq(ticker)

      expect(market.instrument).not.to.be.ok
      expect(market.leverageEnabled).not.to.be.ok
      expect(market.maxLeverage).not.to.be.ok

      let baseSymbolId: string
      let quoteSymbolId: string

      const [symbol] = ticker

      const spliter = symbol.indexOf(':')

      if (spliter >= 0) {

        baseSymbolId = symbol.slice(1, spliter)
        quoteSymbolId = symbol.slice(spliter + 1)

      } else {

        baseSymbolId = symbol.slice(1, 4)
        quoteSymbolId = symbol.slice(4)

      }

      expect(translateSymbolId.callCount).to.be.eq(2)
      expect(translateSymbolId.firstCall.args[0]).to.deep.eq({
        exchangeSymbolId: baseSymbolId,
        symbolMappings: undefined,
      })

      expect(translateSymbolId.secondCall.args[0]).to.deep.eq({
        exchangeSymbolId: quoteSymbolId,
        symbolMappings: undefined,
      })

    },
  )

  it(
    "should parse a Bitfinex raw market just fine (symbol w/o ':')",
    async () => {

      // preparing data
      const translatedSymbolId1 = 'BTC'
      const translatedSymbolId2 = 'ETH'

      const tickers = BITFINEX_RAW_TICKERS
      const enabledMargin = BITFINEX_MARGIN_ENABLED_CURRENCIES

      const ticker = find(tickers, ([symbol]) => symbol.indexOf(':') === -1)!

      const enabledMarginCurrency = find(enabledMargin[0], ticker[0])

      const rawMarket: IBitfinexMarketSchema = {
        enabledMarginCurrency,
        ticker,
      }


      // mocking
      const { translateSymbolId } = mockTranslateSymbolId()
      translateSymbolId.onFirstCall().returns(translatedSymbolId1)
      translateSymbolId.onSecondCall().returns(translatedSymbolId2)


      // executing
      const exchange = new Bitfinex({})

      const { market } = exchange.market.parse({
        rawMarket,
      })


      // validating
      expect(market.exchangeId).to.be.eq(bitfinexBaseSpecs.id)

      expect(market.symbolPair).to.be.eq(ticker[0])
      expect(market.baseSymbolId).to.be.eq(translatedSymbolId1)
      expect(market.quoteSymbolId).to.be.eq(translatedSymbolId2)

      expect(market.spotEnabled).to.be.ok
      expect(market.marginEnabled).to.be.eq(!!enabledMarginCurrency)
      expect(market.derivativesEnabled).not.to.be.ok

      expect(market.ticker.bid).to.be.eq(ticker[1])
      expect(market.ticker.ask).to.be.eq(ticker[3])
      expect(market.ticker.change).to.be.eq(ticker[6])
      expect(market.ticker.last).to.be.eq(ticker[7])
      expect(market.ticker.baseVolume).to.be.eq(ticker[8])
      expect(market.ticker.quoteVolume).to.be.eq(ticker[8] * ticker[1])
      expect(market.ticker.high).to.be.eq(ticker[9])
      expect(market.ticker.low).to.be.eq(ticker[10])
      expect(market.ticker.date).to.be.ok

      expect(market.meta).to.deep.eq(ticker)

      expect(market.instrument).not.to.be.ok
      expect(market.leverageEnabled).not.to.be.ok
      expect(market.maxLeverage).not.to.be.ok

      let baseSymbolId: string
      let quoteSymbolId: string

      const [symbol] = ticker

      const spliter = symbol.indexOf(':')

      if (spliter >= 0) {

        baseSymbolId = symbol.slice(1, spliter)
        quoteSymbolId = symbol.slice(spliter + 1)

      } else {

        baseSymbolId = symbol.slice(1, 4)
        quoteSymbolId = symbol.slice(4)

      }

      expect(translateSymbolId.callCount).to.be.eq(2)
      expect(translateSymbolId.firstCall.args[0]).to.deep.eq({
        exchangeSymbolId: baseSymbolId,
        symbolMappings: undefined,
      })

      expect(translateSymbolId.secondCall.args[0]).to.deep.eq({
        exchangeSymbolId: quoteSymbolId,
        symbolMappings: undefined,
      })

    },
  )

})
