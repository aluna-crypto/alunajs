import debug from 'debug'
import { map } from 'lodash'

import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaPositionParseManyParams,
  IAlunaPositionParseManyReturns,
} from '../../../../../lib/modules/authed/IAlunaPositionModule'
import { IAlunaPositionSchema } from '../../../../../lib/schemas/IAlunaPositionSchema'
import { ISamplePositionSchema } from '../../../schemas/ISamplePositionSchema'



const log = debug('alunajs:sample/position/parseMany')



export const parseMany = (exchange: IAlunaExchangeAuthed) => (
  params: IAlunaPositionParseManyParams<ISamplePositionSchema>,
): IAlunaPositionParseManyReturns => {

  const { rawPositions } = params

  const positions: IAlunaPositionSchema[] = map(rawPositions, (rawPosition) => {

    const { position } = exchange.position!.parse({ rawPosition })

    return position

  })

  log(`parsed ${positions.length} positions`)

  return { positions }

}
