// import debug from 'debug'

import {
  IAlunaSymbolParseParams,
  IAlunaSymbolParseReturns,
} from '../../../../../lib/modules/public/IAlunaSymbolModule'
import { IAlunaSymbolSchema } from '../../../../../lib/schemas/IAlunaSymbolSchema'
import { bittrexBaseSpecs } from '../../../bittrexSpecs'
import { IBittrexSymbolSchema } from '../../../schemas/IBittrexSymbolSchema'



// const log = debug('@aluna.js:bittrex/symbol/parse')



export function parse (
  params: IAlunaSymbolParseParams<IBittrexSymbolSchema>,
): IAlunaSymbolParseReturns {

  const {
    rawSymbol,
  } = params

  const {
    symbol,
    name,
  } = rawSymbol

  const parsedSymbol: IAlunaSymbolSchema = {
    // Use symbol mapping
    id: symbol,
    name,
    exchangeId: bittrexBaseSpecs.id,
    meta: rawSymbol,
  }

  return {
    symbol: parsedSymbol,
  }

}
