import debug from 'debug'
import { each, filter, values } from 'lodash'

import { IAlunaExchangePublic } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaSymbolParseManyParams,
  IAlunaSymbolParseManyReturns,
} from '../../../../../lib/modules/public/IAlunaSymbolModule'
import { IAlunaSymbolSchema } from '../../../../../lib/schemas/IAlunaSymbolSchema'
import { HuobiSymbolStatusEnum } from '../../../enums/HuobiSymbolStatusEnum'
import { IHuobiSymbolSchema } from '../../../schemas/IHuobiSymbolSchema'



const log = debug('alunajs:huobi/symbol/parseMany')



export const parseMany = (exchange: IAlunaExchangePublic) => (
  params: IAlunaSymbolParseManyParams<IHuobiSymbolSchema[]>,
): IAlunaSymbolParseManyReturns => {

  const { rawSymbols } = params


  const parsedSymbolsDict: Record<string, IAlunaSymbolSchema> = {}

  const filteredActiveSymbols = filter(
    rawSymbols,
    {
      state: HuobiSymbolStatusEnum.ONLINE,
    },
  )

  each(filteredActiveSymbols, (rawSymbol) => {

    const {
      bc: baseCurrency,
      qc: quoteCurrency,
    } = rawSymbol

    if (!parsedSymbolsDict[baseCurrency]) {

      const { symbol } = exchange.symbol.parse({ rawSymbol })

      parsedSymbolsDict[baseCurrency] = symbol

    }

    if (!parsedSymbolsDict[quoteCurrency]) {

      const { symbol } = exchange.symbol.parse(
        {
          rawSymbol: {
            ...rawSymbol,
            bc: quoteCurrency,
          },
        },
      )

      parsedSymbolsDict[quoteCurrency] = symbol

    }

  })

  const symbols = values(parsedSymbolsDict)

  log(`parsed ${symbols.length} symbols for Huobi`)

  return { symbols }

}
