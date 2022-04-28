import { IAlunaMarketSchema } from '../../../../lib/schemas/IAlunaMarketSchema'
import { AlunaSymbolMapping } from '../../../../utils/mappings/AlunaSymbolMapping'
import { Okx } from '../../Okx'
import { IOkxMarketWithCurrency } from '../IOkxMarketSchema'
import { IOkxSymbolSchema } from '../IOkxSymbolSchema'



export class OkxMarketParser {

  static parse (params: {
    rawMarket: IOkxMarketWithCurrency,
    rawSpotSymbols: IOkxSymbolSchema[],
    rawMarginSymbols: IOkxSymbolSchema[],
  }): IAlunaMarketSchema {

    const {
      rawMarket,
      rawMarginSymbols,
      rawSpotSymbols,
    } = params

    const pairSpotSymbolsDictionary: { [key:string]: IOkxSymbolSchema } = {}

    rawSpotSymbols.forEach((pair) => {

      const { instId } = pair

      pairSpotSymbolsDictionary[instId] = pair

    })

    const pairMarginSymbolsDictionary: { [key:string]: IOkxSymbolSchema } = {}

    rawMarginSymbols.forEach((pair) => {

      const { instId } = pair

      pairMarginSymbolsDictionary[instId] = pair

    })

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

    const marginEnabled = !!pairMarginSymbolsDictionary[instId]
    const spotEnabled = !!pairSpotSymbolsDictionary[instId]

    return {
      exchangeId: Okx.ID,
      symbolPair: instId,
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
