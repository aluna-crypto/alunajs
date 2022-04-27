import debug from 'debug'

import {
  IAlunaSymbolGetParams,
  IAlunaSymbolGetRawReturns,
} from '../../../../../lib/modules/public/IAlunaSymbolModule'
import { SampleHttp } from '../../../SampleHttp'
import { SAMPLE_PRODUCTION_URL } from '../../../sampleSpecs'



const log = debug('@aluna.js:sample/symbol/getRaw')



export async function getRaw (
  params: IAlunaSymbolGetParams,
): Promise<IAlunaSymbolGetRawReturns<any>> {

  log('params', params)

  const { http = new SampleHttp() } = params

  const rawSymbol = await http.publicRequest<any>({
    url: SAMPLE_PRODUCTION_URL,
  })

  const { requestCount } = http

  return {
    rawSymbol,
    requestCount,
  }

}
