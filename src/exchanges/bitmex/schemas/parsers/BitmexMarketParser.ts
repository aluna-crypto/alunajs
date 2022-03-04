import { BigNumber } from 'bignumber.js'

import { IAlunaMarketSchema } from '../../../../lib/schemas/IAlunaMarketSchema'
import { IAlunaTickerSchema } from '../../../../lib/schemas/IAlunaTickerSchema'
import { AlunaSymbolMapping } from '../../../../utils/mappings/AlunaSymbolMapping'
import { Bitmex } from '../../Bitmex'
import { BitmexSpecs } from '../../BitmexSpecs'
import { IBitmexMarketsSchema } from '../IBitmexMarketsSchema'
import { BitmexInstrumentParser } from './BitmexInstrumentParser'



export class BitmexMarketParser {

  public static parse (params: {
    rawMarket: IBitmexMarketsSchema,
  }): IAlunaMarketSchema {

    const { rawMarket } = params

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

    const baseSymbolId = AlunaSymbolMapping.translateSymbolId({
      exchangeSymbolId: rootSymbol,
      symbolMappings: Bitmex.settings.mappings,
    })

    const quoteSymbolId = AlunaSymbolMapping.translateSymbolId({
      exchangeSymbolId: quoteCurrency,
      symbolMappings: Bitmex.settings.mappings,
    })

    const instrument = BitmexInstrumentParser.parse({
      rawMarket,
    })

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

    const market: IAlunaMarketSchema = {
      symbolPair: symbol,
      exchangeId: BitmexSpecs.id,
      baseSymbolId,
      quoteSymbolId,
      ticker,
      spotEnabled: false,
      marginEnabled: false,
      derivativesEnabled: true,
      instrument,
      maxLeverage,
      leverageEnabled: true,
      meta: rawMarket,
    }

    return market

  }

}
