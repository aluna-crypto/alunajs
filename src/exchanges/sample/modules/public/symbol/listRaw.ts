import debug from 'debug'

import { IAlunaExchangePublic } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaSymbolListParams,
  IAlunaSymbolListRawReturns,
} from '../../../../../lib/modules/public/IAlunaSymbolModule'
import { SampleHttp } from '../../../SampleHttp'
import { SAMPLE_PRODUCTION_URL } from '../../../sampleSpecs'
import { ISampleSymbolSchema } from '../../../schemas/ISampleSymbolSchema'



const log = debug('@aluna.js:sample/symbol/listRaw')



export const listRaw = (exchange: IAlunaExchangePublic) => async (
  params: IAlunaSymbolListParams = {},
): Promise<IAlunaSymbolListRawReturns<ISampleSymbolSchema[]>> => {

  log('fetching Sample raw symbols')

  const { http = new SampleHttp() } = params

  const rawSymbols = await http.publicRequest<ISampleSymbolSchema[]>({
    url: `${SAMPLE_PRODUCTION_URL}/currencies`,
  })

  const { requestCount } = http

  return {
    requestCount,
    rawSymbols,
  }

}
