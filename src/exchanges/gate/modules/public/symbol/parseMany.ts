import debug from 'debug'
import { map } from 'lodash'

import { IAlunaExchangePublic } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaSymbolParseManyParams,
  IAlunaSymbolParseManyReturns,
} from '../../../../../lib/modules/public/IAlunaSymbolModule'
import { IGateSymbolSchema } from '../../../schemas/IGateSymbolSchema'



const log = debug('alunajs:gate/symbol/parseMany')



export const parseMany = (exchange: IAlunaExchangePublic) => (
  params: IAlunaSymbolParseManyParams<IGateSymbolSchema[]>,
): IAlunaSymbolParseManyReturns => {

  const { rawSymbols } = params

  // TODO: Review implementation
  const symbols = map(rawSymbols, (rawSymbol) => {

    const { symbol } = exchange.symbol.parse({ rawSymbol })

    return symbol

  })

  log(`parsed ${symbols.length} symbols for Gate`)

  return { symbols }

}
