import debug from 'debug'
import { each, values } from 'lodash'

import { IAlunaExchangePublic } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaSymbolParseManyParams,
  IAlunaSymbolParseManyReturns,
} from '../../../../../lib/modules/public/IAlunaSymbolModule'
import { IAlunaSymbolSchema } from '../../../../../lib/schemas/IAlunaSymbolSchema'
import { IBinanceSymbolSchema } from '../../../schemas/IBinanceSymbolSchema'



const log = debug('@alunajs:binance/symbol/parseMany')



export const parseMany = (exchange: IAlunaExchangePublic) => (
  params: IAlunaSymbolParseManyParams<IBinanceSymbolSchema[]>,
): IAlunaSymbolParseManyReturns => {

  const { rawSymbols } = params

  const parsedSymbolsDict: Record<string, IAlunaSymbolSchema> = {}

  each(rawSymbols, (rawSymbol) => {

    const {
      baseAsset,
      quoteAsset,
    } = rawSymbol

    if (!parsedSymbolsDict[baseAsset]) {

      const { symbol: parsedBaseSymbol } = exchange.symbol.parse({ rawSymbol })

      parsedSymbolsDict[baseAsset] = parsedBaseSymbol

    }

    if (!parsedSymbolsDict[quoteAsset]) {

      const { symbol: parsedQuoteSymbol } = exchange.symbol.parse({
        rawSymbol: {
          ...rawSymbol,
          baseAsset: quoteAsset,
        },
      })

      parsedSymbolsDict[quoteAsset] = parsedQuoteSymbol

    }

  })

  const symbols = values(parsedSymbolsDict)

  log(`parsed ${symbols.length} symbols for Binance`)

  return { symbols }

}
