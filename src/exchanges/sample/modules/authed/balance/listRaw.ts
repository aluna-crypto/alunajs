import { debug } from 'debug'

import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaBalanceListParams,
  IAlunaBalanceListRawReturns,
} from '../../../../../lib/modules/authed/IAlunaBalanceModule'
import { SampleHttp } from '../../../SampleHttp'
import { SAMPLE_PRODUCTION_URL } from '../../../sampleSpecs'



const log = debug('@aluna.js:sample/balance/listRaw')



// TODO: replace all generic types <any>

export const listRaw = (exchange: IAlunaExchangeAuthed) => async (
  params: IAlunaBalanceListParams,
): Promise<IAlunaBalanceListRawReturns<any>> => {

  log('params', params)

  const { credentials } = exchange

  const { http = new SampleHttp() } = params

  const rawBalances = await http.authedRequest<any[]>({
    url: SAMPLE_PRODUCTION_URL,
    credentials,
  })

  const { requestCount } = http

  return {
    rawBalances,
    requestCount,
  }

}
