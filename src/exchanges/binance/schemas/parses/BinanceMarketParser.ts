import { IAlunaMarketSchema } from '../../../../lib/schemas/IAlunaMarketSchema'
import { AlunaSymbolMapping } from '../../../../utils/mappings/AlunaSymbolMapping'
import { Binance } from '../../Binance'
import { IBinanceMarketWithCurrency } from '../IBinanceMarketSchema'



export class BinanceMarketParser {

  static parse (params: {
    rawMarket: IBinanceMarketWithCurrency,
  }): IAlunaMarketSchema {

    const { rawMarket } = params

    const {
      askPrice,
      volume,
      bidPrice,
      highPrice,
      lastPrice,
      lowPrice,
      baseCurrency,
      quoteCurrency,
      priceChange,
      quoteVolume,
      symbol,
      marginEnabled,
      spotEnabled,
    } = rawMarket

    const symbolMappings = Binance.settings.mappings

    const baseSymbolId = AlunaSymbolMapping.translateSymbolId({
      exchangeSymbolId: baseCurrency,
      symbolMappings,
    })

    const quoteSymbolId = AlunaSymbolMapping.translateSymbolId({
      exchangeSymbolId: quoteCurrency,
      symbolMappings,
    })

    const ticker = {
      high: parseFloat(highPrice),
      low: parseFloat(lowPrice),
      bid: parseFloat(bidPrice),
      ask: parseFloat(askPrice),
      last: parseFloat(lastPrice),
      date: new Date(),
      change: parseFloat(priceChange) / 100,
      baseVolume: parseFloat(volume),
      quoteVolume: parseFloat(quoteVolume),
    }

    return {
      exchangeId: Binance.ID,
      symbolPair: symbol,
      baseSymbolId,
      quoteSymbolId,
      ticker,
      spotEnabled,
      marginEnabled,
      derivativesEnabled: false,
      leverageEnabled: false,
      meta: rawMarket,
    }

  }

}
