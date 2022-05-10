import { expect } from 'chai'
import { cloneDeep } from 'lodash'

import { mockTranslateSymbolId } from '../../../../../utils/mappings/translateSymbolId.mock'
import { Bitfinex } from '../../../Bitfinex'
import { bitfinexBaseSpecs } from '../../../bitfinexSpecs'
import { IBitfinexMarketSchema } from '../../../schemas/IBitfinexMarketSchema'
import {
  BITFINEX_MARGIN_ENABLED_CURRENCIES,
  BITFINEX_RAW_TICKERS,
} from '../../../test/fixtures/bitfinexMarket'
import { mockSplitSymbolPair } from './helpers/splitSymbolPair.mock'



describe(__filename, () => {

  it(
    "should parse a Bitfinex raw market just fine (symbol w/ ':')",
    async () => {

      // preparing data
      const translatedSymbolId1 = 'BTC'
      const translatedSymbolId2 = 'ETH'

      const ticker = cloneDeep(BITFINEX_RAW_TICKERS[0])
      ticker[0] = 'tLUNA:BTC'

      const enabledMarginCurrency = BITFINEX_MARGIN_ENABLED_CURRENCIES[0][0]

      const rawMarket: IBitfinexMarketSchema = {
        enabledMarginCurrency,
        ticker,
      }

      runTest({
        rawMarket,
        translatedSymbolId1,
        translatedSymbolId2,
      })

    },
  )

  it(
    "should parse a Bitfinex raw market just fine (symbol w/o ':')",
    async () => {

      // preparing data
      const translatedSymbolId1 = 'BTC'
      const translatedSymbolId2 = 'ETH'

      const ticker = cloneDeep(BITFINEX_RAW_TICKERS[0])
      ticker[0] = 'tBTCUSD'

      const enabledMarginCurrency = BITFINEX_MARGIN_ENABLED_CURRENCIES[0][0]

      const rawMarket: IBitfinexMarketSchema = {
        enabledMarginCurrency,
        ticker,
      }

      runTest({
        rawMarket,
        translatedSymbolId1,
        translatedSymbolId2,
      })

    },
  )



  const runTest = (params: {
    rawMarket: IBitfinexMarketSchema
    translatedSymbolId1: string
    translatedSymbolId2: string
  }) => {

    const {
      rawMarket,
      translatedSymbolId1,
      translatedSymbolId2,
    } = params


    // mocking
    const { translateSymbolId } = mockTranslateSymbolId()
    translateSymbolId.onFirstCall().returns(translatedSymbolId1)
    translateSymbolId.onSecondCall().returns(translatedSymbolId2)

    const { splitSymbolPair } = mockSplitSymbolPair({
      baseSymbolId: translatedSymbolId1,
      quoteSymbolId: translatedSymbolId2,
    })


    // executing
    const symbolMappings = {}
    const exchange = new Bitfinex({ settings: { symbolMappings } })

    const { market } = exchange.market.parse({
      rawMarket,
    })


    // validating
    const {
      ticker,
      enabledMarginCurrency,
    } = rawMarket

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


    expect(splitSymbolPair.callCount).to.be.eq(1)
    expect(splitSymbolPair.firstCall.args[0]).to.deep.eq({
      symbolPair: ticker[0],
    })

    expect(translateSymbolId.callCount).to.be.eq(2)
    expect(translateSymbolId.firstCall.args[0]).to.deep.eq({
      exchangeSymbolId: translatedSymbolId1,
      symbolMappings,
    })

    expect(translateSymbolId.secondCall.args[0]).to.deep.eq({
      exchangeSymbolId: translatedSymbolId2,
      symbolMappings,
    })

  }

})
