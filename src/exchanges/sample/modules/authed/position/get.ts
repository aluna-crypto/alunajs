import debug from 'debug'

import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaPositionGetParams,
  IAlunaPositionGetReturns,
} from '../../../../../lib/modules/authed/IAlunaPositionModule'
import { SampleHttp } from '../../../SampleHttp'



const log = debug('@alunajs:sample/position/get')



export const get = (exchange: IAlunaExchangeAuthed) => async (
  params: IAlunaPositionGetParams,
): Promise<IAlunaPositionGetReturns> => {

  const {
    id,
    symbolPair,
    http = new SampleHttp(exchange.settings),
  } = params

  log('getting position', { id, symbolPair })

  const { rawPosition } = await exchange.position!.getRaw({
    id,
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
