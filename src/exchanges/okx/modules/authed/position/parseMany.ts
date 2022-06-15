import debug from 'debug'
import { map } from 'lodash'

import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaPositionParseManyParams,
  IAlunaPositionParseManyReturns,
} from '../../../../../lib/modules/authed/IAlunaPositionModule'
import { IAlunaPositionSchema } from '../../../../../lib/schemas/IAlunaPositionSchema'
import { IOkxPositionSchema } from '../../../schemas/IOkxPositionSchema'



const log = debug('alunajs:okx/position/parseMany')



export const parseMany = (exchange: IAlunaExchangeAuthed) => (
  params: IAlunaPositionParseManyParams<IOkxPositionSchema>,
): IAlunaPositionParseManyReturns => {

  const { rawPositions } = params

  const positions: IAlunaPositionSchema[] = map(rawPositions, (rawPosition) => {

    const { position } = exchange.position!.parse({ rawPosition })

    return position

  })

  log(`parsed ${positions.length} positions`)

  return { positions }

}
