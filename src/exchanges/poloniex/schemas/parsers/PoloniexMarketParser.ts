import { IAlunaMarketSchema } from '../../../../lib/schemas/IAlunaMarketSchema'
import { AlunaSymbolMapping } from '../../../../utils/mappings/AlunaSymbolMapping'
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

    const baseSymbolId = AlunaSymbolMapping.translateSymbolId({
      exchangeSymbolId: baseCurrency,
      symbolMappings: Poloniex.settings.mappings,
    })

    const quoteSymbolId = AlunaSymbolMapping.translateSymbolId({
      exchangeSymbolId: quoteCurrency,
      symbolMappings: Poloniex.settings.mappings,
    })

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
