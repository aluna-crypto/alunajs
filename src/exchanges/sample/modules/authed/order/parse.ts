import { debug } from 'debug'

import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaOrderParseParams,
  IAlunaOrderParseReturns,
} from '../../../../../lib/modules/authed/IAlunaOrderModule'
import { IAlunaOrderSchema } from '../../../../../lib/schemas/IAlunaOrderSchema'
import { SampleHttp } from '../../../SampleHttp'
import { SAMPLE_PRODUCTION_URL } from '../../../sampleSpecs'



const log = debug('@aluna.js:sample/order/parse')



export const parse = (exchange: IAlunaExchangeAuthed) => async (
  params: IAlunaOrderParseParams,
): Promise<IAlunaOrderParseReturns> => {

  log('params', params)

  const { credentials } = exchange

  const { http = new SampleHttp() } = params

  const order = await http.authedRequest<IAlunaOrderSchema>({
    url: SAMPLE_PRODUCTION_URL,
    credentials,
  })

  const { requestCount } = http

  return {
    order,
    requestCount,
  }

}
