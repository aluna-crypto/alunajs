import { IAlunaMarketSchema } from '../../../../lib/schemas/IAlunaMarketSchema'
import { AlunaSymbolMapping } from '../../../../utils/mappings/AlunaSymbolMapping'
import { Huobi } from '../../Huobi'
import { IHuobiMarketWithCurrency } from '../HuobiMarketSchema'



export class HuobiMarketParser {

  static parse (params: {
    rawMarket: IHuobiMarketWithCurrency,
  }): IAlunaMarketSchema {

    const { rawMarket } = params

    const {
      baseCurrency,
      quoteCurrency,
      symbol,
      high,
      low,
      ask,
      bid,
      amount,
      vol,
    } = rawMarket

    const symbolMappings = Huobi.settings.mappings

    const baseSymbolId = AlunaSymbolMapping.translateSymbolId({
      exchangeSymbolId: baseCurrency,
      symbolMappings,
    })

    const quoteSymbolId = AlunaSymbolMapping.translateSymbolId({
      exchangeSymbolId: quoteCurrency,
      symbolMappings,
    })

    const ticker = {
      high,
      low,
      bid,
      ask,
      last: amount, // @TODO -> Update value
      date: new Date(),
      change: 0, // @TODO -> Update value
      baseVolume: vol,
      quoteVolume: vol, // @TODO -> Update value
    }

    return {
      exchangeId: Huobi.ID,
      symbolPair: symbol,
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
