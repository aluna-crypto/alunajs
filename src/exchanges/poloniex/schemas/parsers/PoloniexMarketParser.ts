import { IAlunaMarketSchema } from '../../../../lib/schemas/IAlunaMarketSchema'
import { Poloniex } from '../../Poloniex'
import { IPoloniexMarketWithCurrency } from '../IPoloniexMarketSchema'



export class PoloniexMarketParser {

  static parse (params: {
    rawMarket: IPoloniexMarketWithCurrency,
  }): IAlunaMarketSchema {

    const { rawMarket } = params

    const {
      baseCurrency,
      quoteCurrency,
      quoteVolume,
      baseVolume,
      currencyPair,
      high24hr,
      highestBid,
      last,
      low24hr,
      lowestAsk,
      percentChange,
    } = rawMarket


    const ticker = {
      high: parseFloat(high24hr),
      low: parseFloat(low24hr),
      bid: parseFloat(highestBid),
      ask: parseFloat(lowestAsk),
      last: parseFloat(last),
      date: new Date(),
      change: parseFloat(percentChange),
      baseVolume: parseFloat(baseVolume),
      quoteVolume: parseFloat(quoteVolume),
    }

    return {
      exchangeId: Poloniex.ID,
      symbolPair: currencyPair,
      baseSymbolId: baseCurrency,
      quoteSymbolId: quoteCurrency,
      ticker,
      spotEnabled: true,
      marginEnabled: false,
      derivativesEnabled: false,
      leverageEnabled: false,
      meta: rawMarket,
    }

  }

}
