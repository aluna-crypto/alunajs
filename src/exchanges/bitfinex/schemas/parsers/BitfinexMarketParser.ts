import { IAlunaMarketSchema } from '../../../../lib/schemas/IAlunaMarketSchema'
import { IAlunaTickerSchema } from '../../../../lib/schemas/IAlunaTickerSchema'
import { AlunaSymbolMapping } from '../../../../utils/mappings/AlunaSymbolMapping'
import { Bitfinex } from '../../Bitfinex'
import { IBitfinexTicker } from '../IBitfinexMarketSchema'
import { BitfinexSymbolParser } from './BitfinexSymbolParser'



export interface IBitfinexMarketParseParams {
  rawTicker: IBitfinexTicker
  enabledMarginMarketsDict: Record<string, string>
}



export class BitfinexMarketParser {

  static parse (params: IBitfinexMarketParseParams) {

    const {
      rawTicker,
      enabledMarginMarketsDict,
    } = params

    const [
      symbol,
      bid,
      _bid_size,
      ask,
      _ask_size,
      _daily_change,
      dailyChangeRelative,
      lastPrice,
      volume,
      high,
      low,
    ] = rawTicker

    let {
      baseSymbolId,
      quoteSymbolId,
    } = BitfinexSymbolParser.splitSymbolPair({ symbolPair: symbol })

    const symbolMappings = Bitfinex.settings.mappings

    baseSymbolId = AlunaSymbolMapping.translateSymbolId({
      exchangeSymbolId: baseSymbolId,
      symbolMappings,
    })

    quoteSymbolId = AlunaSymbolMapping.translateSymbolId({
      exchangeSymbolId: quoteSymbolId,
      symbolMappings,
    })
    const ticker: IAlunaTickerSchema = {
      bid,
      ask,
      high,
      low,
      last: lastPrice,
      date: new Date(),
      baseVolume: volume,
      quoteVolume: volume * bid, // estimate
      change: dailyChangeRelative,
    }

    const marginEnabled = !!enabledMarginMarketsDict[symbol.slice(1)]

    const parsedMarket: IAlunaMarketSchema = {
      exchangeId: Bitfinex.ID,
      symbolPair: symbol,
      baseSymbolId,
      quoteSymbolId,
      ticker,
      spotEnabled: true,
      marginEnabled,
      derivativesEnabled: false,
      leverageEnabled: false,
      meta: rawTicker,
    }

    return parsedMarket

  }

}
