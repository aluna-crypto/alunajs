import { IAlunaMarketSchema } from '../../../../lib/schemas/IAlunaMarketSchema'
import { IAlunaTickerSchema } from '../../../../lib/schemas/IAlunaTickerSchema'
import { Bitfinex } from '../../Bitfinex'
import { IBitfinexTicker } from '../IBitfinexMarketSchema'
import { TBitfinexCurrencySym } from '../IBitfinexSymbolSchema'



export interface IBitfinexMarketParseParams {
  rawTicker: IBitfinexTicker
  enabledMarginMarketsDict: Record<string, string>
  currencySymsDict: Record<string, TBitfinexCurrencySym>
}



export class BitfinexMarketParser {

  static parse (params: IBitfinexMarketParseParams) {

    const {
      rawTicker,
      currencySymsDict,
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

    let baseSymbolId: string
    let quoteSymbolId: string

    const spliter = symbol.indexOf(':')

    if (spliter >= 0) {

      baseSymbolId = symbol.slice(1, spliter)
      quoteSymbolId = symbol.slice(spliter + 1)

    } else {

      baseSymbolId = symbol.slice(1, 4)
      quoteSymbolId = symbol.slice(4)

    }

    baseSymbolId = currencySymsDict[baseSymbolId]
      ? currencySymsDict[baseSymbolId][1].toUpperCase()
      : baseSymbolId

    quoteSymbolId = currencySymsDict[quoteSymbolId]
      ? currencySymsDict[quoteSymbolId][1].toUpperCase()
      : quoteSymbolId

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
