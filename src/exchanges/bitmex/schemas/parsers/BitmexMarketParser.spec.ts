import { BigNumber } from 'bignumber.js'
import { expect } from 'chai'
import { each } from 'lodash'
import { ImportMock } from 'ts-mock-imports'

import { IAlunaInstrumentSchema } from '../../../../lib/schemas/IAlunaInstrumentSchema'
import { IAlunaTickerSchema } from '../../../../lib/schemas/IAlunaTickerSchema'
import { mockAlunaSymbolMapping } from '../../../../utils/mappings/AlunaSymbolMapping.mock'
import { Bitmex } from '../../Bitmex'
import { BITMEX_RAW_SYMBOLS } from '../../test/bitmexSymbols'
import { BitmexInstrumentParser } from './BitmexInstrumentParser'
import { BitmexMarketParser } from './BitmexMarketParser'



describe('BitmexMarketParser', () => {


  it('should properly parse Bitmex markets', () => {

    const mockedInstrument = {} as IAlunaInstrumentSchema

    const translatedSymbolId = 'BTC'

    const { alunaSymbolMappingMock } = mockAlunaSymbolMapping({
      returnSymbol: translatedSymbolId,
    })

    const bitmexInstrumentParserMock = ImportMock.mockFunction(
      BitmexInstrumentParser,
      'parse',
      mockedInstrument,
    )

    each(BITMEX_RAW_SYMBOLS, (rawMarket, index) => {

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

      const parsedMarket = BitmexMarketParser.parse({
        rawMarket,
      })

      expect(parsedMarket.exchangeId).to.be.eq(Bitmex.ID)

      expect(parsedMarket.symbolPair).to.be.eq(symbol)

      expect(parsedMarket.baseSymbolId).to.be.eq(translatedSymbolId)
      expect(parsedMarket.quoteSymbolId).to.be.eq(translatedSymbolId)

      expect(parsedMarket.instrument).to.deep.eq(mockedInstrument)

      expect(parsedMarket.ticker.high).to.be.eq(ticker.high)
      expect(parsedMarket.ticker.low).to.be.eq(ticker.low)
      expect(parsedMarket.ticker.bid).to.be.eq(ticker.bid)
      expect(parsedMarket.ticker.ask).to.be.eq(ticker.ask)
      expect(parsedMarket.ticker.last).to.be.eq(ticker.last)
      expect(parsedMarket.ticker.change).to.be.eq(ticker.change)
      expect(parsedMarket.ticker.baseVolume).to.be.eq(ticker.baseVolume)
      expect(parsedMarket.ticker.quoteVolume).to.be.eq(ticker.quoteVolume)

      expect(parsedMarket.maxLeverage).to.be.eq(maxLeverage)
      expect(parsedMarket.leverageEnabled).to.be.ok

      expect(parsedMarket.spotEnabled).not.to.be.ok
      expect(parsedMarket.marginEnabled).not.to.be.ok

      expect(parsedMarket.meta).to.deep.eq(rawMarket)

      const mappingCallCount = index === 0
        ? 2
        : (index + 1) * 2

      const argsIndex = index === 0
        ? 0
        : index * 2

      expect(alunaSymbolMappingMock.callCount).to.be.eq(mappingCallCount)
      expect(alunaSymbolMappingMock.args[argsIndex][0]).to.deep.eq({
        exchangeSymbolId: rootSymbol,
        symbolMappings: {},
      })
      expect(alunaSymbolMappingMock.args[argsIndex + 1][0]).to.deep.eq({
        exchangeSymbolId: quoteCurrency,
        symbolMappings: {},
      })

    })

    const { length } = BITMEX_RAW_SYMBOLS

    expect(bitmexInstrumentParserMock.callCount).to.be.eq(length)

  })

})
