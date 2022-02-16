import { IAlunaMarketSchema } from '../../../../lib/schemas/IAlunaMarketSchema'
import { Bittrex } from '../../Bittrex'
import { IBittrexMarketWithTicker } from '../IBittrexMarketSchema'



export class BittrexMarketParser {

  static parse (params: {
    rawMarket: IBittrexMarketWithTicker,
  }): IAlunaMarketSchema {

    const { rawMarket } = params

    const {
      volume,
      quoteVolume,
      symbol,
      baseCurrencySymbol,
      quoteCurrencySymbol,
      askRate,
      bidRate,
      high,
      lastTradeRate,
      low,
      percentChange,
    } = rawMarket


    const ticker = {
      high: parseFloat(high),
      low: parseFloat(low),
      bid: parseFloat(bidRate),
      ask: parseFloat(askRate),
      last: parseFloat(lastTradeRate),
      date: new Date(),
      change: parseFloat(percentChange) / 100,
      baseVolume: parseFloat(volume),
      quoteVolume: parseFloat(quoteVolume),
    }

    return {
      exchangeId: Bittrex.ID,
      symbolPair: symbol,
      baseSymbolId: baseCurrencySymbol,
      quoteSymbolId: quoteCurrencySymbol,
      ticker,
      spotEnabled: true,
      marginEnabled: false,
      derivativesEnabled: false,
      leverageEnabled: false,
      meta: rawMarket,
    }

  }

}
