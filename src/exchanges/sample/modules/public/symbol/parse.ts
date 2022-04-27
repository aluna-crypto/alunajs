import debug from 'debug'

import {
  IAlunaSymbolParseParams,
  IAlunaSymbolParseReturns,
} from '../../../../../lib/modules/public/IAlunaSymbolModule'
import { IAlunaSymbolSchema } from '../../../../../lib/schemas/IAlunaSymbolSchema'
import { SampleHttp } from '../../../SampleHttp'
import { SAMPLE_PRODUCTION_URL } from '../../../sampleSpecs'



const log = debug('@aluna.js:sample/symbol/parse')



export async function parse (
  params: IAlunaSymbolParseParams,
): Promise<IAlunaSymbolParseReturns> {

  log('params', params)

  const { http = new SampleHttp() } = params

  const symbol = await http.publicRequest<IAlunaSymbolSchema>({
    url: SAMPLE_PRODUCTION_URL,
  })

  const { requestCount } = http

  return {
    symbol,
    requestCount,
  }

}
