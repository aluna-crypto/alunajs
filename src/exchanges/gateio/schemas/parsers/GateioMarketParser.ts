import { IAlunaMarketSchema } from '../../../../lib/schemas/IAlunaMarketSchema'
import { Gateio } from '../../Gateio'
import { IGateioMarketWithCurrency } from '../IGateioMarketSchema'



export class GateioMarketParser {

  static parse (params: {
    rawMarket: IGateioMarketWithCurrency,
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
      baseCurrency,
      quoteCurrency,
    } = rawMarket


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
