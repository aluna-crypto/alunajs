import debug from 'debug'

import {
  IAlunaSymbolListParams,
  IAlunaSymbolListRawReturns,
} from '../../../../../lib/modules/public/IAlunaSymbolModule'
import { SampleHttp } from '../../../SampleHttp'
import { SAMPLE_PRODUCTION_URL } from '../../../sampleSpecs'



const log = debug('@aluna.js:sample/symbol/listRaw')



export async function listRaw (
  params: IAlunaSymbolListParams = {},
): Promise<IAlunaSymbolListRawReturns<any>> {

  log('params', params)

  const { http = new SampleHttp() } = params

  const rawSymbols = await http.publicRequest<any[]>({
    url: SAMPLE_PRODUCTION_URL,
  })

  const { requestCount } = http

  return {
    rawSymbols,
    requestCount,
  }

}
