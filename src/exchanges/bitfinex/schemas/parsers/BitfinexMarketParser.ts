import {
  IAlunaMarketSchema,
  IAlunaTickerSchema,
} from '../../../..'
import { Bitfinex } from '../../Bitfinex'
import { IBitfinexTicker } from '../IBitfinexMarketSchema'
import { TBitfinexCurrencySym } from '../IBitfinexSymbolSchema'



export interface IBitfinexMarketParseParams {
  rawTicker: IBitfinexTicker
  isMarginEnabled: boolean
  currencySymsDict: Record<string, TBitfinexCurrencySym>
}



export class BitfinexMarketParser {

  static parse (params: IBitfinexMarketParseParams) {

    const {
      rawTicker,
      isMarginEnabled,
      currencySymsDict,
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

    if (currencySymsDict[baseSymbolId]) {

      const [, fixedBaseSymbol] = currencySymsDict[baseSymbolId]

      baseSymbolId = fixedBaseSymbol.toUpperCase()

    }

    if (currencySymsDict[baseSymbolId]) {

      const [, fixedQuoteSymbol] = currencySymsDict[baseSymbolId]

      quoteSymbolId = fixedQuoteSymbol.toUpperCase()

    }

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

    const parsedMarket: IAlunaMarketSchema = {
      exchangeId: Bitfinex.ID,

      symbolPair: symbol,

      baseSymbolId,
      quoteSymbolId,

      ticker,

      spotEnabled: true,
      marginEnabled: isMarginEnabled,
      derivativesEnabled: false,

      leverageEnabled: false,

      meta: rawTicker,
    }

    return parsedMarket

  }

}
