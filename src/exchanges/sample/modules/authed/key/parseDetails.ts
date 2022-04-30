import { debug } from 'debug'

import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaKeyParseDetailsParams,
  IAlunaKeyParseDetailsReturns,
} from '../../../../../lib/modules/authed/IAlunaKeyModule'
import { IAlunaKeySchema } from '../../../../../lib/schemas/IAlunaKeySchema'
import { SampleHttp } from '../../../SampleHttp'
import { SAMPLE_PRODUCTION_URL } from '../../../sampleSpecs'
import { ISampleKeySchema } from '../../../schemas/ISampleKeySchema'



const log = debug('@aluna.js:sample/key/parseDetails')



export const parseDetails = (exchange: IAlunaExchangeAuthed) => async (
  params: IAlunaKeyParseDetailsParams<ISampleKeySchema>,
): Promise<IAlunaKeyParseDetailsReturns> => {

  log('params', params)

  const { credentials } = exchange

  const { http = new SampleHttp() } = params

  const key = await http.authedRequest<IAlunaKeySchema>({
    url: SAMPLE_PRODUCTION_URL,
    credentials,
  })

  const { requestCount } = http

  return {
    key,
    requestCount,
  }

}
