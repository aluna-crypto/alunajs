import { IAlunaMarketSchema } from '@lib/schemas/IAlunaMarketSchema'

import { IMarketWithCurrency } from '../../modules/ValrMarketModule'



export class ValrMarketParser {

  static parse (params: {
    rawMarket: IMarketWithCurrency,
  }): IAlunaMarketSchema {

    const {
      rawMarket: {
        askPrice,
        baseVolume,
        bidPrice,
        changeFromPrevious,
        highPrice,
        lastTradedPrice,
        lowPrice,
        baseCurrency,
        quoteCurrency,
        currencyPair,
      },
    } = params


    const ticker = {
      high: parseFloat(highPrice),
      low: parseFloat(lowPrice),
      bid: parseFloat(bidPrice),
      ask: parseFloat(askPrice),
      last: parseFloat(lastTradedPrice),
      date: new Date(new Date().toDateString()),
      change: parseFloat(changeFromPrevious) / 100,
      baseVolume: parseFloat(baseVolume),
      quoteVolume: 0,
    }

    return {
      pairSymbol: currencyPair,
      baseSymbol: baseCurrency,
      quoteSymbol: quoteCurrency,
      ticker,
      spotEnabled: false,
      marginEnabled: false,
      derivativesEnabled: false,
    }

  }

}
