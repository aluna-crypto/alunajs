import { debug } from 'debug'

import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaPositionGetParams,
  IAlunaPositionGetRawReturns,
} from '../../../../../lib/modules/authed/IAlunaPositionModule'
import { SampleHttp } from '../../../SampleHttp'
import { SAMPLE_PRODUCTION_URL } from '../../../sampleSpecs'



const log = debug('@aluna.js:sample/position/getRaw')



// TODO: replace all generic types <any>

export const getRaw = (exchange: IAlunaExchangeAuthed) => async (
  params: IAlunaPositionGetParams,
): Promise<IAlunaPositionGetRawReturns<any>> => {

  log('params', params)

  const { credentials } = exchange

  const { http = new SampleHttp() } = params

  const rawPosition = await http.authedRequest<any>({
    url: SAMPLE_PRODUCTION_URL,
    credentials,
  })

  const { requestCount } = http

  return {
    rawPosition,
    requestCount,
  }

}
