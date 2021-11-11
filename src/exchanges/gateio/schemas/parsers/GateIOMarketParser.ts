import { IAlunaMarketSchema } from '../../../../lib/schemas/IAlunaMarketSchema'
import { IGateIOMarketSchema } from '../IGateIOMarketSchema'



export class GateIOMarketParser {

  static parse (params: {
    rawMarket: IGateIOMarketSchema,
  }): IAlunaMarketSchema {

    const {
      rawMarket: {
        id,
        base,
        quote,
        ticker: {
          last,
          lowest_ask,
          highest_bid,
          change_percentage,
          base_volume,
          quote_volume,
          high_24h,
          low_24h,
        },
      },
    } = params

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
      pairSymbol: `${base}${quote}`,
      baseSymbolId: base,
      quoteSymbolId: quote,
      ticker,
      spotEnabled: true,
      marginEnabled: false,
      derivativesEnabled: false,
    }

  }

}
