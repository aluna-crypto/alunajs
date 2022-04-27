import debug from 'debug'

import {
  IAlunaMarketListParams,
  IAlunaMarketListRawReturns,
} from '../../../../../lib/modules/public/IAlunaMarketModule'
import { SampleHttp } from '../../../SampleHttp'
import { SAMPLE_PRODUCTION_URL } from '../../../sampleSpecs'



const log = debug('@aluna.js:sample/market/listRaw')



export async function listRaw (
  params: IAlunaMarketListParams = {},
): Promise<IAlunaMarketListRawReturns<any>> {

  log('params', params)

  const { http = new SampleHttp() } = params

  const rawMarkets = await http.publicRequest<any[]>({
    url: SAMPLE_PRODUCTION_URL,
  })

  const { requestCount } = http

  return {
    rawMarkets,
    requestCount,
  }

}
