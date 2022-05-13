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
    symbolPair,
    http = new BitmexHttp(exchange.settings),
  } = params

  log('getting position', { symbolPair })

  const { rawPosition } = await exchange.position!.getRaw({
    http,
    symbolPair,
  })

  const { position } = exchange.position!.parse({ rawPosition })

  const { requestWeight } = http

  return {
    position,
    requestWeight,
  }

}
