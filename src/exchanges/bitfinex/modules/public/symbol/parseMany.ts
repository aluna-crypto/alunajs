import debug from 'debug'
import { map } from 'lodash'

import { IAlunaExchangePublic } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaSymbolParseManyParams,
  IAlunaSymbolParseManyReturns,
} from '../../../../../lib/modules/public/IAlunaSymbolModule'
import { IBitfinexSymbolSchema } from '../../../schemas/IBitfinexSymbolSchema'



const log = debug('@alunajs:bitfinex/symbol/parseMany')



export const parseMany = (exchange: IAlunaExchangePublic) => (
  params: IAlunaSymbolParseManyParams<IBitfinexSymbolSchema[]>,
): IAlunaSymbolParseManyReturns => {

  const { rawSymbols } = params

  // TODO: Review implementation
  const symbols = map(rawSymbols, (rawSymbol) => {

    const { symbol } = exchange.symbol.parse({ rawSymbol })

    return symbol

  })

  log(`parsed ${symbols.length} symbols for Bitfinex`)

  return { symbols }

}
