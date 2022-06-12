import debug from 'debug'
import { each } from 'lodash'

import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaPositionParseManyParams,
  IAlunaPositionParseManyReturns,
} from '../../../../../lib/modules/authed/IAlunaPositionModule'
import { IAlunaPositionSchema } from '../../../../../lib/schemas/IAlunaPositionSchema'
import { IFtxPositionSchema } from '../../../schemas/IFtxPositionSchema'



const log = debug('alunajs:ftx/position/parseMany')



export const parseMany = (exchange: IAlunaExchangeAuthed) => (
  params: IAlunaPositionParseManyParams<IFtxPositionSchema[]>,
): IAlunaPositionParseManyReturns => {

  const { rawPositions } = params

  const positions: IAlunaPositionSchema[] = []

  each(rawPositions, (rawPosition) => {

    const { size } = rawPosition

    // skipping closed positions
    if (size === 0) {
      return
    }

    const { position } = exchange.position!.parse({ rawPosition })

    positions.push(position)

  })

  log(`parsed ${positions.length} positions`)

  return { positions }

}
