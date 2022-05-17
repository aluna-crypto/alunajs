import debug from 'debug'
import {
  each,
  values,
} from 'lodash'

import { IAlunaExchangePublic } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaSymbolParseManyParams,
  IAlunaSymbolParseManyReturns,
} from '../../../../../lib/modules/public/IAlunaSymbolModule'
import { IAlunaSymbolSchema } from '../../../../../lib/schemas/IAlunaSymbolSchema'
import { IFtxMarketSchema } from '../../../schemas/IFtxMarketSchema'



const log = debug('@alunajs:ftx/symbol/parseMany')



export const parseMany = (exchange: IAlunaExchangePublic) => (
  params: IAlunaSymbolParseManyParams<IFtxMarketSchema[]>,
): IAlunaSymbolParseManyReturns => {

  const { rawSymbols } = params

  const parsedSymbolsDict: Record<string, IAlunaSymbolSchema> = {}

  each(rawSymbols, (symbolPair) => {

    const {
      baseCurrency,
      quoteCurrency,
    } = symbolPair

    if (!parsedSymbolsDict[baseCurrency]) {

      const {
        symbol: parsedBaseSymbol,
      } = exchange.symbol.parse({ rawSymbol: symbolPair })

      parsedSymbolsDict[baseCurrency] = parsedBaseSymbol

    }

    if (!parsedSymbolsDict[quoteCurrency]) {

      const {
        symbol: parsedQuoteSymbol,
      } = exchange.symbol.parse({
        rawSymbol: {
          ...symbolPair,
          baseCurrency: quoteCurrency,
        },
      })

      parsedSymbolsDict[quoteCurrency] = parsedQuoteSymbol

    }

  })

  const symbols = values(parsedSymbolsDict)

  log(`parsed ${symbols.length} symbols for Ftx`)

  return { symbols }

}
