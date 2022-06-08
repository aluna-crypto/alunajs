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
import { splitFtxSymbolPair } from '../market/helpers/splitFtxSymbolPair'



const log = debug('alunajs:ftx/symbol/parseMany')



export const parseMany = (exchange: IAlunaExchangePublic) => (
  params: IAlunaSymbolParseManyParams<IFtxMarketSchema[]>,
): IAlunaSymbolParseManyReturns => {

  const { rawSymbols } = params

  const parsedSymbolsDict: Record<string, IAlunaSymbolSchema> = {}

  each(rawSymbols, (rawSymbol) => {

    const { name } = rawSymbol

    const {
      baseSymbolId,
      quoteSymbolId,
    } = splitFtxSymbolPair({ market: name })

    if (!parsedSymbolsDict[baseSymbolId]) {

      const { symbol } = exchange.symbol.parse({ rawSymbol })

      parsedSymbolsDict[baseSymbolId] = symbol

    }

    if (!parsedSymbolsDict[quoteSymbolId]) {

      const { symbol } = exchange.symbol.parse({
        rawSymbol: {
          ...rawSymbol,
          baseCurrency: quoteSymbolId,
        },
      })

      parsedSymbolsDict[quoteSymbolId] = symbol

    }

  })

  const symbols = values(parsedSymbolsDict)

  log(`parsed ${symbols.length} symbols for Ftx`)

  return { symbols }

}
