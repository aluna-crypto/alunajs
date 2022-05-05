import debug from 'debug'
import {
  keyBy,
  reduce,
} from 'lodash'

import { IAlunaExchangePublic } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaSymbolParseManyParams,
  IAlunaSymbolParseManyReturns,
} from '../../../../../lib/modules/public/IAlunaSymbolModule'
import { IAlunaSymbolSchema } from '../../../../../lib/schemas/IAlunaSymbolSchema'
import {
  IBitfinexSymbolSchema,
  IBitfinexSymbolsSchema,
} from '../../../schemas/IBitfinexSymbolSchema'



const log = debug('@alunajs:bitfinex/symbol/parseMany')



export const parseMany = (exchange: IAlunaExchangePublic) => (
  params: IAlunaSymbolParseManyParams<IBitfinexSymbolsSchema>,
): IAlunaSymbolParseManyReturns => {

  const { rawSymbols } = params

  const {
    currencies,
    currenciesNames,
  } = rawSymbols

  const currenciesNamesDict = keyBy(currenciesNames, 0)

  const symbols = reduce<string, IAlunaSymbolSchema[]>(currencies, (acc, currency) => {



    const rawSymbol: IBitfinexSymbolSchema = {
      currency,
      currencyName: currenciesNamesDict[currency],
    }

    const { symbol } = exchange.symbol.parse({ rawSymbol })

    acc.push(symbol)

    return acc

  }, [])

  log(`parsed ${symbols.length} symbols for Bitfinex`)

  return { symbols }

}
