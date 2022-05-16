import debug from 'debug'
import {
  forOwn,
  map,
} from 'lodash'

import { IAlunaExchangePublic } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaSymbolParseManyParams,
  IAlunaSymbolParseManyReturns,
} from '../../../../../lib/modules/public/IAlunaSymbolModule'
import {
  IPoloniexSymbolResponseSchema,
  IPoloniexSymbolSchema,
} from '../../../schemas/IPoloniexSymbolSchema'



const log = debug('@alunajs:poloniex/symbol/parseMany')



export const parseMany = (exchange: IAlunaExchangePublic) => (
  params: IAlunaSymbolParseManyParams<IPoloniexSymbolResponseSchema>,
): IAlunaSymbolParseManyReturns => {

  const {
    rawSymbols: rawSymbolsResponse,
  } = params

  const rawSymbols: IPoloniexSymbolSchema[] = []

  forOwn(rawSymbolsResponse, (value, key) => {

    rawSymbols.push({
      currency: key,
      ...value,
    })

  })

  const symbols = map(rawSymbols, (rawSymbol) => {

    const { symbol } = exchange.symbol.parse({ rawSymbol })

    return symbol

  })

  log(`parsed ${symbols.length} symbols for Poloniex`)

  return { symbols }

}
