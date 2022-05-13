import debug from 'debug'
import { each } from 'lodash'

import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaPositionParseManyParams,
  IAlunaPositionParseManyReturns,
} from '../../../../../lib/modules/authed/IAlunaPositionModule'
import { IAlunaPositionSchema } from '../../../../../lib/schemas/IAlunaPositionSchema'
import { IBitfinexPositionSchema } from '../../../schemas/IBitfinexPositionSchema'



const log = debug('@alunajs:bitfinex/position/parseMany')



export const parseMany = (exchange: IAlunaExchangeAuthed) => (
  params: IAlunaPositionParseManyParams<IBitfinexPositionSchema[]>,
): IAlunaPositionParseManyReturns => {

  const { rawPositions } = params

  const positions: IAlunaPositionSchema[] = []

  each(rawPositions, (rawPosition) => {

    // skipping derivative positions for now
    if (/^(f)|(F0)/.test(rawPosition[0])) {
      return
    }

    const { position } = exchange.position!.parse({ rawPosition })

    positions.push(position)

  })

  log(`parsed ${positions.length} positions`)

  return { positions }

}
