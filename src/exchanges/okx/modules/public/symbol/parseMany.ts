import debug from 'debug'
import {
  each,
  filter,
  values,
} from 'lodash'

import { IAlunaExchangePublic } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaSymbolParseManyParams,
  IAlunaSymbolParseManyReturns,
} from '../../../../../lib/modules/public/IAlunaSymbolModule'
import { IAlunaSymbolSchema } from '../../../../../lib/schemas/IAlunaSymbolSchema'
import { OkxSymbolStatusEnum } from '../../../enums/OkxSymbolStatusEnum'
import { IOkxSymbolSchema } from '../../../schemas/IOkxSymbolSchema'



const log = debug('alunajs:okx/symbol/parseMany')



export const parseMany = (exchange: IAlunaExchangePublic) => (
  params: IAlunaSymbolParseManyParams<IOkxSymbolSchema[]>,
): IAlunaSymbolParseManyReturns => {

  const { rawSymbols } = params

  const parsedSymbolsDict: Record<string, IAlunaSymbolSchema> = {}

  const filteredRawActiveSymbols = filter(
    rawSymbols,
    {
      state: OkxSymbolStatusEnum.LIVE || OkxSymbolStatusEnum.PREOPEN,
    },
  )

  each(filteredRawActiveSymbols, (rawSymbol) => {

    const {
      baseCcy,
      quoteCcy,
    } = rawSymbol

    if (!parsedSymbolsDict[baseCcy]) {

      const { symbol } = exchange.symbol.parse({ rawSymbol })

      parsedSymbolsDict[baseCcy] = symbol

    }

    if (!parsedSymbolsDict[quoteCcy]) {

      const { symbol } = exchange.symbol.parse({
        rawSymbol: {
          ...rawSymbol,
          baseCcy: quoteCcy,
        },
      })

      parsedSymbolsDict[quoteCcy] = symbol

    }

  })

  const symbols = values(parsedSymbolsDict)

  log(`parsed ${symbols.length} symbols for Okx`)

  return { symbols }

}
