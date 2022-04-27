import debug from 'debug'
import { map } from 'lodash'

import { IAlunaExchangePublic } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaSymbolParseManyParams,
  IAlunaSymbolParseManyReturns,
} from '../../../../../lib/modules/public/IAlunaSymbolModule'
import { IBittrexSymbolSchema } from '../../../schemas/IBittrexSymbolSchema'



const log = debug('@aluna.js:bittrex/symbol/parseMany')



export const parseMany = (exchange: IAlunaExchangePublic) => (
  params: IAlunaSymbolParseManyParams<IBittrexSymbolSchema[]>,
): IAlunaSymbolParseManyReturns => {

  const {
    rawSymbols,
  } = params

  const symbols = map(rawSymbols, (rawSymbol) => {

    const { symbol } = exchange.symbol.parse({
      rawSymbol,
    })

    return symbol

  })

  log(`parsed ${symbols.length} symbols for Bittrex`)

  return {
    symbols,
  }

}
