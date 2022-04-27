import { debug } from 'debug'

import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaPositionGetLeverageParams,
  IAlunaPositionGetLeverageReturns,
} from '../../../../../lib/modules/authed/IAlunaPositionModule'
import { SampleHttp } from '../../../SampleHttp'
import { SAMPLE_PRODUCTION_URL } from '../../../sampleSpecs'



const log = debug('@aluna.js:sample/position/getLeverage')



export const getLeverage = (exchange: IAlunaExchangeAuthed) => async (
  params: IAlunaPositionGetLeverageParams,
): Promise<IAlunaPositionGetLeverageReturns> => {

  log('params', params)

  const { credentials } = exchange

  const { http = new SampleHttp() } = params

  const leverage = await http.authedRequest<number>({
    url: SAMPLE_PRODUCTION_URL,
    credentials,
  })

  const { requestCount } = http

  return {
    leverage,
    requestCount,
  }

}
