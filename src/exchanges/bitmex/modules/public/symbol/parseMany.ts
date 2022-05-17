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
import { IBitmexSymbolSchema } from '../../../schemas/IBitmexSymbolSchema'



const log = debug('alunajs:bitmex/symbol/parseMany')



export const parseMany = (exchange: IAlunaExchangePublic) => (
  params: IAlunaSymbolParseManyParams<IBitmexSymbolSchema[]>,
): IAlunaSymbolParseManyReturns => {

  const { rawSymbols } = params

  const parsedSymbolsDict: Record<string, IAlunaSymbolSchema> = {}

  each(rawSymbols, (rawSymbol) => {

    const {
      rootSymbol,
      quoteCurrency,
    } = rawSymbol

    if (!parsedSymbolsDict[rootSymbol]) {

      const { symbol } = exchange.symbol.parse({ rawSymbol })

      parsedSymbolsDict[rootSymbol] = symbol

    }

    if (!parsedSymbolsDict[quoteCurrency]) {

      const { symbol } = exchange.symbol.parse({
        rawSymbol: {
          ...rawSymbol,
          rootSymbol: quoteCurrency,
        },
      })

      parsedSymbolsDict[quoteCurrency] = symbol

    }

  })

  const symbols = values(parsedSymbolsDict)

  log(`parsed ${symbols.length} symbols for Bitmex`)

  return { symbols }

}
