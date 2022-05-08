import debug from 'debug'

import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaPositionListParams,
  IAlunaPositionListRawReturns,
} from '../../../../../lib/modules/authed/IAlunaPositionModule'
import { SampleHttp } from '../../../SampleHttp'
import { sampleEndpoints } from '../../../sampleSpecs'
import { ISamplePositionSchema } from '../../../schemas/ISamplePositionSchema'



const log = debug('@alunajs:sample/position/listRaw')



export const listRaw = (exchange: IAlunaExchangeAuthed) => async (
  params: IAlunaPositionListParams = {},
): Promise<IAlunaPositionListRawReturns<ISamplePositionSchema[]>> => {

  log('listing raw positions', params)

  const {
    http = new SampleHttp(exchange.settings),
  } = params

  const { credentials } = exchange

  const rawPositions = await http.authedRequest<ISamplePositionSchema[]>({
    credentials,
    url: sampleEndpoints.position.list,
  })

  const { requestCount } = http

  return {
    rawPositions,
    requestCount,
  }

}
