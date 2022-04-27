import debug from 'debug'

import {
  IAlunaMarketGetParams,
  IAlunaMarketGetRawReturns,
} from '../../../../../lib/modules/public/IAlunaMarketModule'
import { SampleHttp } from '../../../SampleHttp'
import { SAMPLE_PRODUCTION_URL } from '../../../sampleSpecs'



const log = debug('@aluna.js:sample/market/getRaw')



export async function getRaw (
  params: IAlunaMarketGetParams,
): Promise<IAlunaMarketGetRawReturns<any>> {

  log('params', params)

  const { http = new SampleHttp() } = params

  const rawMarket = await http.publicRequest<any>({
    url: SAMPLE_PRODUCTION_URL,
  })

  const { requestCount } = http

  return {
    rawMarket,
    requestCount,
  }

}
