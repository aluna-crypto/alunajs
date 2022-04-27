import debug from 'debug'

import {
  IAlunaSymbolParseManyParams,
  IAlunaSymbolParseManyReturns,
} from '../../../../../lib/modules/public/IAlunaSymbolModule'
import { IAlunaSymbolSchema } from '../../../../../lib/schemas/IAlunaSymbolSchema'
import { SampleHttp } from '../../../SampleHttp'
import { SAMPLE_PRODUCTION_URL } from '../../../sampleSpecs'



const log = debug('@aluna.js:sample/symbol/parseMany')



export async function parseMany (
  params: IAlunaSymbolParseManyParams,
): Promise<IAlunaSymbolParseManyReturns> {

  log('params', params)

  const { http = new SampleHttp() } = params

  const symbols = await http.publicRequest<IAlunaSymbolSchema[]>({
    url: SAMPLE_PRODUCTION_URL,
  })

  const { requestCount } = http

  return {
    symbols,
    requestCount,
  }

}
