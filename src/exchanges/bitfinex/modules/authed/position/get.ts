import debug from 'debug'

import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaPositionGetParams,
  IAlunaPositionGetReturns,
} from '../../../../../lib/modules/authed/IAlunaPositionModule'
import { BitfinexHttp } from '../../../BitfinexHttp'



const log = debug('@alunajs:bitfinex/position/get')



export const get = (exchange: IAlunaExchangeAuthed) => async (
  params: IAlunaPositionGetParams,
): Promise<IAlunaPositionGetReturns> => {

  const {
    id,
    http = new BitfinexHttp(),
  } = params

  log('getting position', { id })

  const { rawPosition } = await exchange.position!.getRaw({ id, http })

  const { position } = await exchange.position!.parse({ rawPosition })

  const { requestCount } = http

  return {
    position,
    requestCount,
  }

}
