import { IAlunaMarketSchema } from '../../../../lib/schemas/IAlunaMarketSchema'
import { AlunaSymbolMapping } from '../../../../utils/mappings/AlunaSymbolMapping'
import { Valr } from '../../Valr'
import { IMarketWithCurrencies } from '../IValrMarketSchema'



export class ValrMarketParser {

  static parse (params: {
    rawMarket: IMarketWithCurrencies,
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

    const baseSymbolId = AlunaSymbolMapping.translateSymbolId({
      exchangeSymbolId: baseCurrency,
      symbolMappings: Valr.settings.mappings,
    })

    const quoteSymbolId = AlunaSymbolMapping.translateSymbolId({
      exchangeSymbolId: quoteCurrency,
      symbolMappings: Valr.settings.mappings,
    })

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
      baseSymbolId,
      quoteSymbolId,
      ticker,
      spotEnabled: false,
      marginEnabled: false,
      derivativesEnabled: false,
      leverageEnabled: false,
      meta: rawMarket,
    }

  }

}
