import debug from 'debug'
import { map } from 'lodash'

import {
  IAlunaSymbolParseManyParams,
  IAlunaSymbolParseManyReturns,
} from '../../../../../lib/modules/public/IAlunaSymbolModule'
import { IBittrexSymbolSchema } from '../../../schemas/IBittrexSymbolSchema'
import { parse } from './parse'



const log = debug('@aluna.js:bittrex/symbol/parseMany')



export function parseMany (
  params: IAlunaSymbolParseManyParams<IBittrexSymbolSchema[]>,
): IAlunaSymbolParseManyReturns {

  const {
    rawSymbols,
  } = params

  const symbols = map(rawSymbols, (rawSymbol) => {

    const { symbol } = parse({
      rawSymbol,
    })

    return symbol

  })

  log(`parsed ${symbols.length} symbols for Bittrex`)

  return {
    symbols,
  }

}
