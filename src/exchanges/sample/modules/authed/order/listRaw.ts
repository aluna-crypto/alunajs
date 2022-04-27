import { debug } from 'debug'

import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaOrderListParams,
  IAlunaOrderListRawReturns,
} from '../../../../../lib/modules/authed/IAlunaOrderModule'
import { SampleHttp } from '../../../SampleHttp'
import { SAMPLE_PRODUCTION_URL } from '../../../sampleSpecs'



const log = debug('@aluna.js:sample/order/listRaw')



// TODO: replace all generic types <any>

export const listRaw = (exchange: IAlunaExchangeAuthed) => async (
  params: IAlunaOrderListParams,
): Promise<IAlunaOrderListRawReturns<any>> => {

  log('params', params)

  const { credentials } = exchange

  const { http = new SampleHttp() } = params

  const rawOrders = await http.authedRequest<any[]>({
    url: SAMPLE_PRODUCTION_URL,
    credentials,
  })

  const { requestCount } = http

  return {
    rawOrders,
    requestCount,
  }

}
