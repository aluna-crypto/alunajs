import debug from 'debug'

import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaPositionGetParams,
  IAlunaPositionGetReturns,
} from '../../../../../lib/modules/authed/IAlunaPositionModule'
import { BitmexHttp } from '../../../BitmexHttp'



const log = debug('@alunajs:bitmex/position/get')



export const get = (exchange: IAlunaExchangeAuthed) => async (
  params: IAlunaPositionGetParams,
): Promise<IAlunaPositionGetReturns> => {

  const {
    id,
    symbolPair,
    http = new BitmexHttp(exchange.settings),
  } = params

  log('getting position', { id, symbolPair })

  const { rawPosition } = await exchange.position!.getRaw({ id, http })

  const { position } = await exchange.position!.parse({ rawPosition })

  const { requestWeight } = http

  return {
    position,
    requestWeight,
  }

}
