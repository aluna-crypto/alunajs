import debug from 'debug'

import {
  IAlunaMarketGetParams,
  IAlunaMarketGetReturns,
} from '../../../../../lib/modules/public/IAlunaMarketModule'
import { IAlunaMarketSchema } from '../../../../../lib/schemas/IAlunaMarketSchema'
import { SampleHttp } from '../../../SampleHttp'
import { SAMPLE_PRODUCTION_URL } from '../../../sampleSpecs'



const log = debug('@aluna.js:sample/market/get')



export async function get (
  params: IAlunaMarketGetParams,
): Promise<IAlunaMarketGetReturns> {

  log('params', params)

  const { http = new SampleHttp() } = params

  const market = await http.publicRequest<IAlunaMarketSchema>({
    url: SAMPLE_PRODUCTION_URL,
  })

  const { requestCount } = http

  return {
    market,
    requestCount,
  }

}
