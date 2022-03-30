import { IAlunaMarketSchema } from '../../../../lib/schemas/IAlunaMarketSchema'
import { AlunaSymbolMapping } from '../../../../utils/mappings/AlunaSymbolMapping'
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

    const [baseCurrency, quoteCurrency] = currency_pair.split('_')

    const baseSymbolId = AlunaSymbolMapping.translateSymbolId({
      exchangeSymbolId: baseCurrency,
      symbolMappings: Gateio.settings.mappings,
    })

    const quoteSymbolId = AlunaSymbolMapping.translateSymbolId({
      exchangeSymbolId: quoteCurrency,
      symbolMappings: Gateio.settings.mappings,
    })

    const ticker = {
      high: Number(high_24h),
      low: Number(low_24h),
      bid: Number(highest_bid),
      ask: Number(lowest_ask),
      last: Number(last),
      date: new Date(),
      change: Number(change_percentage),
      baseVolume: Number(base_volume),
      quoteVolume: Number(quote_volume),
    }

    return {
      exchangeId: Gateio.ID,
      symbolPair: currency_pair,
      baseSymbolId,
      quoteSymbolId,
      ticker,
      spotEnabled: true,
      marginEnabled: false,
      derivativesEnabled: false,
      leverageEnabled: false,
      meta: rawMarket,
    }

  }

}
