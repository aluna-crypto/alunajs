import { IAlunaMarketSchema } from '../../../../lib/schemas/IAlunaMarketSchema'
import { Gateio } from '../../Gateio'
import { IGateioMarketSchema } from '../IGateioMarketSchema'



export class GateioMarketParser {

  static parse (params: {
    rawMarket: IGateioMarketSchema,
  }): IAlunaMarketSchema {

    const { rawMarket } = params

    const {
      base_volume,
      change_percentage,
      currency_pair,
      high_24h,
      highest_bid,
      last,
      low_24h,
      lowest_ask,
      quote_volume,
    } = rawMarket

    const splittedSymbol = currency_pair.split('_')
    const baseCurrency = splittedSymbol[0]
    const quoteCurrency = splittedSymbol[1]


    const ticker = {
      high: parseFloat(high_24h),
      low: parseFloat(low_24h),
      bid: parseFloat(highest_bid),
      ask: parseFloat(lowest_ask),
      last: parseFloat(last),
      date: new Date(),
      change: parseFloat(change_percentage),
      baseVolume: parseFloat(base_volume),
      quoteVolume: parseFloat(quote_volume),
    }

    return {
      exchangeId: Gateio.ID,
      symbolPair: currency_pair,
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
