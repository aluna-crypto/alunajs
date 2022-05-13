import debug from 'debug'
import {
  keyBy,
  map,
} from 'lodash'

import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaPositionParseManyParams,
  IAlunaPositionParseManyReturns,
} from '../../../../../lib/modules/authed/IAlunaPositionModule'
import {
  IBitmexPositionSchema,
  IBitmexPositionsSchema,
} from '../../../schemas/IBitmexPositionSchema'



const log = debug('@alunajs:bitmex/position/parseMany')



export const parseMany = (exchange: IAlunaExchangeAuthed) => (
  params: IAlunaPositionParseManyParams<IBitmexPositionsSchema>,
): IAlunaPositionParseManyReturns => {


  const {
    rawPositions: {
      bitmexPositions,
      markets,
    },
  } = params

  const marketsDict = keyBy(markets, 'symbolPair')

  const positions = map(bitmexPositions, (bitmexPosition) => {

    const { symbol } = bitmexPosition

    const rawPosition: IBitmexPositionSchema = {
      bitmexPosition,
      market: marketsDict[symbol],
    }

    const { position } = exchange.position!.parse({ rawPosition })

    return position

  })

  log(`parsed ${positions.length} positions`)

  return { positions }

}
