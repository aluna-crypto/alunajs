import { IAlunaMarketSchema } from '../../../../lib/schemas/IAlunaMarketSchema'
import { AlunaSymbolMapping } from '../../../../utils/mappings/AlunaSymbolMapping'
import { Okx } from '../../Okx'
import { IOkxMarketWithCurrency } from '../IOkxMarketSchema'



export class OkxMarketParser {

  static parse (params: {
    rawMarket: IOkxMarketWithCurrency,
  }): IAlunaMarketSchema {

    const { rawMarket } = params

    const {
      baseCurrency,
      quoteCurrency,
      askPx,
      bidPx,
      high24h,
      instId,
      last,
      low24h,
      open24h,
      vol24h,
      volCcy24h,
    } = rawMarket

    const symbolMappings = Okx.settings.mappings

    const baseSymbolId = AlunaSymbolMapping.translateSymbolId({
      exchangeSymbolId: baseCurrency,
      symbolMappings,
    })

    const quoteSymbolId = AlunaSymbolMapping.translateSymbolId({
      exchangeSymbolId: quoteCurrency,
      symbolMappings,
    })

    const change = parseFloat(open24h) - parseFloat(last)

    const ticker = {
      high: parseFloat(high24h),
      low: parseFloat(low24h),
      bid: parseFloat(bidPx),
      ask: parseFloat(askPx),
      last: parseFloat(last),
      date: new Date(),
      change,
      baseVolume: parseFloat(vol24h),
      quoteVolume: parseFloat(volCcy24h),
    }

    return {
      exchangeId: Okx.ID,
      symbolPair: instId,
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
