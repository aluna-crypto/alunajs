import { debug } from 'debug'

import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaPositionListParams,
  IAlunaPositionListRawReturns,
} from '../../../../../lib/modules/authed/IAlunaPositionModule'
import { SampleHttp } from '../../../SampleHttp'
import { SAMPLE_PRODUCTION_URL } from '../../../sampleSpecs'



const log = debug('@aluna.js:sample/position/listRaw')



// TODO: replace all generic types <any>

export const listRaw = (exchange: IAlunaExchangeAuthed) => async (
  params: IAlunaPositionListParams,
): Promise<IAlunaPositionListRawReturns<any>> => {

  log('params', params)

  const { credentials } = exchange

  const { http = new SampleHttp() } = params

  const rawPositions = await http.authedRequest<any[]>({
    url: SAMPLE_PRODUCTION_URL,
    credentials,
  })

  const { requestCount } = http

  return {
    rawPositions,
    requestCount,
  }

}
