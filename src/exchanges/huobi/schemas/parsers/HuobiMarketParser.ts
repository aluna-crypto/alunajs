import { IAlunaMarketSchema } from '../../../../lib/schemas/IAlunaMarketSchema'
import { AlunaSymbolMapping } from '../../../../utils/mappings/AlunaSymbolMapping'
import { Huobi } from '../../Huobi'
import { IHuobiMarketWithCurrency } from '../IHuobiMarketSchema'



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
      close,
      open,
      amount: baseVolume,
      vol: quoteVolume,
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

    const change = open - close

    const ticker = {
      high,
      low,
      bid,
      ask,
      last: close,
      date: new Date(),
      change,
      baseVolume,
      quoteVolume,
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
