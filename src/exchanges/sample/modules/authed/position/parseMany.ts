import { debug } from 'debug'

import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaPositionParseManyParams,
  IAlunaPositionParseManyReturns,
} from '../../../../../lib/modules/authed/IAlunaPositionModule'
import { IAlunaPositionSchema } from '../../../../../lib/schemas/IAlunaPositionSchema'
import { SampleHttp } from '../../../SampleHttp'
import { SAMPLE_PRODUCTION_URL } from '../../../sampleSpecs'



const log = debug('@aluna.js:sample/position/parseMany')



export const parseMany = (exchange: IAlunaExchangeAuthed) => async (
  params: IAlunaPositionParseManyParams,
): Promise<IAlunaPositionParseManyReturns> => {

  log('params', params)

  const { credentials } = exchange

  const { http = new SampleHttp() } = params

  const positions = await http.authedRequest<IAlunaPositionSchema[]>({
    url: SAMPLE_PRODUCTION_URL,
    credentials,
  })

  const { requestCount } = http

  return {
    positions,
    requestCount,
  }

}
