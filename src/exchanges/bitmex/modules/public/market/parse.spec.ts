import BigNumber from 'bignumber.js'
import { expect } from 'chai'
import { each } from 'lodash'
import { ImportMock } from 'ts-mock-imports'

import { IAlunaInstrumentSchema } from '../../../../../lib/schemas/IAlunaInstrumentSchema'
import { IAlunaSettingsSchema } from '../../../../../lib/schemas/IAlunaSettingsSchema'
import { IAlunaTickerSchema } from '../../../../../lib/schemas/IAlunaTickerSchema'
import { mockTranslateSymbolId } from '../../../../../utils/mappings/translateSymbolId.mock'
import { Bitmex } from '../../../Bitmex'
import { BITMEX_RAW_MARKETS } from '../../../test/fixtures/bitmexMarket'
import * as computeMinMaxTradeAmountMod from './helpers/computeMinMaxTradeAmount'
import { mockParseBitmexInstrument } from './helpers/parseBitmexInstrument.mock'



describe(__filename, () => {

  it('should parse a Bitmex raw market just fine', async () => {

    // preparing data
    const instrument = {} as IAlunaInstrumentSchema

    const translatedSymbolId = 'BTC'

    const minTradeAmount = 1
    const maxTradeAmount = 100


    // mocking
    const { translateSymbolId } = mockTranslateSymbolId()
    translateSymbolId.returns(translatedSymbolId)

    const { parseBitmexInstrument } = mockParseBitmexInstrument()
    parseBitmexInstrument.returns({ instrument })

    const computeMinMaxTradeAmount = ImportMock.mockFunction(
      computeMinMaxTradeAmountMod,
      'computeMinMaxTradeAmount',
      {
        minTradeAmount,
        maxTradeAmount,
      },
    )

    each(BITMEX_RAW_MARKETS, (rawMarket, index) => {

      // executing
      const settings: IAlunaSettingsSchema = {}
      const exchange = new Bitmex({ settings })

      const { market } = exchange.market.parse({ rawMarket })


      // validating
      const {
        symbol,
        rootSymbol,
        quoteCurrency,
        highPrice,
        lowPrice,
        bidPrice,
        lastPrice,
        prevClosePrice,
        volume24h,
        askPrice,
        initMargin,
      } = rawMarket

      const change = (1 - (lastPrice / prevClosePrice))
      const quoteVolume = volume24h
      const baseVolume = new BigNumber(volume24h)
        .div(bidPrice)
        .toNumber()

      const ticker: IAlunaTickerSchema = {
        high: highPrice,
        low: lowPrice,
        bid: bidPrice,
        ask: askPrice,
        last: lastPrice,
        change,
        date: new Date(),
        baseVolume,
        quoteVolume,
      }

      const maxLeverage = (1 / initMargin)

      expect(market.exchangeId).to.be.eq(exchange.id)

      expect(market.symbolPair).to.be.eq(symbol)

      expect(market.baseSymbolId).to.be.eq(translatedSymbolId)
      expect(market.quoteSymbolId).to.be.eq(translatedSymbolId)

      expect(market.instrument).to.deep.eq(instrument)

      expect(market.ticker.high).to.be.eq(ticker.high)
      expect(market.ticker.low).to.be.eq(ticker.low)
      expect(market.ticker.bid).to.be.eq(ticker.bid)
      expect(market.ticker.ask).to.be.eq(ticker.ask)
      expect(market.ticker.last).to.be.eq(ticker.last)
      expect(market.ticker.change).to.be.eq(ticker.change)
      expect(market.ticker.baseVolume).to.be.eq(ticker.baseVolume)
      expect(market.ticker.quoteVolume).to.be.eq(ticker.quoteVolume)

      expect(market.minTradeAmount).to.be.eq(minTradeAmount)
      expect(market.maxTradeAmount).to.be.eq(maxTradeAmount)

      expect(market.maxLeverage).to.be.eq(maxLeverage)
      expect(market.leverageEnabled).to.be.ok

      expect(market.spotEnabled).not.to.be.ok
      expect(market.marginEnabled).not.to.be.ok

      expect(market.meta).to.deep.eq(rawMarket)

      const translateSymbolIdCallCount = index === 0
        ? 2
        : (index + 1) * 2

      const argsIndex = index === 0
        ? 0
        : index * 2

      expect(translateSymbolId.callCount).to.be.eq(translateSymbolIdCallCount)
      expect(translateSymbolId.args[argsIndex][0]).to.deep.eq({
        exchangeSymbolId: rootSymbol,
        symbolMappings: settings.symbolMappings,
      })
      expect(translateSymbolId.args[argsIndex + 1][0]).to.deep.eq({
        exchangeSymbolId: quoteCurrency,
        symbolMappings: settings.symbolMappings,
      })

    })

    const { length } = BITMEX_RAW_MARKETS

    expect(parseBitmexInstrument.callCount).to.be.eq(length)

    expect(computeMinMaxTradeAmount.callCount).to.be.eq(length)

  })

})
