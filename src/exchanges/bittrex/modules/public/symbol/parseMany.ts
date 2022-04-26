import debug from 'debug'
import { map } from 'lodash'

import {
  IAlunaSymbolParseManyParams,
  IAlunaSymbolParseManyReturns,
} from '../../../../../lib/modules/public/IAlunaSymbolModule'
import { BittrexHttp } from '../../../BittrexHttp'
import { parse } from './parse'



const log = debug('@aluna.js:bittrex/symbol/parseMany')



export async function parseMany (
  params: IAlunaSymbolParseManyParams,
): Promise<IAlunaSymbolParseManyReturns> {

  const {
    rawSymbols,
    http = new BittrexHttp(),
  } = params

  const symbolsPromises = map(rawSymbols, async (rawSymbol) => {

    const { symbol } = await parse({
      rawSymbol,
    })

    return symbol

  })

  const symbols = await Promise.all(symbolsPromises)

  log(`parsed ${symbols.length} symbols for Bittrex`)

  const { requestCount } = http

  return {
    symbols,
    requestCount,
  }

}
