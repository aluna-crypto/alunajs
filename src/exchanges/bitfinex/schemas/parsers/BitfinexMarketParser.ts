import { IAlunaMarketSchema } from '../../../../lib/schemas/IAlunaMarketSchema'
import { IAlunaTickerSchema } from '../../../../lib/schemas/IAlunaTickerSchema'
import { Bitfinex } from '../../Bitfinex'
import { BitfinexSymbolMapping } from '../../mappings/BitfinexSymbolMapping'
import { IBitfinexTicker } from '../IBitfinexMarketSchema'



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
      bid,,
      ask,,,
      dailyChangeRelative,
      lastPrice,
      volume,
      high,
      low,
    ] = rawTicker

    const {
      baseSymbolId,
      quoteSymbolId,
    } = BitfinexSymbolMapping.translateToAluna({
      symbolPair: symbol,
      mappings: Bitfinex.mappings,
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
