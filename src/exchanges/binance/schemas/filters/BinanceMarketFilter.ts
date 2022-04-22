import { map } from 'lodash'

import { BinanceSymbolStatusEnum } from '../../enums/BinanceSymbolStatusEnum'
import {
  IBinanceMarketSchema,
} from '../IBinanceMarketSchema'
import { IBinanceSymbolSchema } from '../IBinanceSymbolSchema'



export class BinanceMarketFilter {

  static filter (params: {
      rawMarkets: IBinanceMarketSchema[],
      rawSymbols: IBinanceSymbolSchema[],
    }): IBinanceMarketSchema[] {

    const {
      rawMarkets,
      rawSymbols,
    } = params

    const symbolDictionary:
        { [key:string]: IBinanceSymbolSchema } = {}

    rawSymbols.forEach((pair) => {

      const { symbol } = pair

      symbolDictionary[symbol] = pair

    })

    const filteredRawMarkets: IBinanceMarketSchema[] = []

    map(rawMarkets, (rawMarket) => {

      const { symbol } = rawMarket

      const rawSymbol = symbolDictionary[symbol]

      const isOnline = rawSymbol
        && rawSymbol.status !== BinanceSymbolStatusEnum.BREAK

      if (isOnline) {

        return filteredRawMarkets.push(rawMarket)

      }

    })

    return filteredRawMarkets

  }

}
