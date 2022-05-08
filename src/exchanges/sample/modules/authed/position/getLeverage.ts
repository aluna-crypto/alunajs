import debug from 'debug'

import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaPositionGetLeverageParams,
  IAlunaPositionGetLeverageReturns,
} from '../../../../../lib/modules/authed/IAlunaPositionModule'
import { SampleHttp } from '../../../SampleHttp'
import { sampleEndpoints } from '../../../sampleSpecs'



const log = debug('@alunajs:sample/position/getLeverage')



export const getLeverage = (exchange: IAlunaExchangeAuthed) => async (
  params: IAlunaPositionGetLeverageParams,
): Promise<IAlunaPositionGetLeverageReturns> => {

  const {
    id,
    symbolPair,
    http = new SampleHttp(exchange.settings),
  } = params

  log('getting leverage', { id, symbolPair })

  const { credentials } = exchange

  // TODO: Implement proper getter
  const leverage = await http.authedRequest<number>({
    credentials,
    url: sampleEndpoints.position.getLeverage,
    body: { id, symbolPair },
  })

  const { requestCount } = http

  return {
    leverage,
    requestCount,
  }

}
