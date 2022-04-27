import debug from 'debug'

import {
  IAlunaMarketListParams,
  IAlunaMarketListReturns,
} from '../../../../../lib/modules/public/IAlunaMarketModule'
import { IAlunaMarketSchema } from '../../../../../lib/schemas/IAlunaMarketSchema'
import { SampleHttp } from '../../../SampleHttp'
import { SAMPLE_PRODUCTION_URL } from '../../../sampleSpecs'



const log = debug('@aluna.js:sample/market/list')



export async function list (
  params: IAlunaMarketListParams = {},
): Promise<IAlunaMarketListReturns> {

  log('params', params)

  const { http = new SampleHttp() } = params

  const markets = await http.publicRequest<IAlunaMarketSchema[]>({
    url: SAMPLE_PRODUCTION_URL,
  })

  const { requestCount } = http

  return {
    markets,
    requestCount,
  }

}
