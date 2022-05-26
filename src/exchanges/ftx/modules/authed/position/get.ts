import debug from 'debug'

import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaPositionGetParams,
  IAlunaPositionGetReturns,
} from '../../../../../lib/modules/authed/IAlunaPositionModule'
import { FtxHttp } from '../../../FtxHttp'



const log = debug('alunajs:bitfinex/position/get')



export const get = (exchange: IAlunaExchangeAuthed) => async (
  params: IAlunaPositionGetParams,
): Promise<IAlunaPositionGetReturns> => {

  const {
    symbolPair,
    http = new FtxHttp(exchange.settings),
  } = params

  log('getting position', { symbolPair })

  const { rawPosition } = await exchange.position!.getRaw({
    symbolPair, http,
  })

  const { position } = exchange.position!.parse({ rawPosition })

  const { requestWeight } = http

  return {
    position,
    requestWeight,
  }

}
