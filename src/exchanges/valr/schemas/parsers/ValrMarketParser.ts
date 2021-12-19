import { IAlunaMarketSchema } from '../../../../lib/schemas/IAlunaMarketSchema'
import { IMarketWithCurrency } from '../../modules/ValrMarketModule'
import { Valr } from '../../Valr'



export class ValrMarketParser {

  static parse (params: {
    rawMarket: IMarketWithCurrency,
  }): IAlunaMarketSchema {

    const { rawMarket } = params

    const {
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
    } = rawMarket


    const ticker = {
      high: parseFloat(highPrice),
      low: parseFloat(lowPrice),
      bid: parseFloat(bidPrice),
      ask: parseFloat(askPrice),
      last: parseFloat(lastTradedPrice),
      date: new Date(),
      change: parseFloat(changeFromPrevious) / 100,
      baseVolume: parseFloat(baseVolume),
      quoteVolume: 0,
    }

    return {
      exchangeId: Valr.ID,
      symbolPair: currencyPair,
      baseSymbolId: baseCurrency,
      quoteSymbolId: quoteCurrency,
      ticker,
      spotEnabled: false,
      marginEnabled: false,
      derivativesEnabled: false,
      leverageEnabled: false,
      meta: rawMarket,
    }

  }

}
