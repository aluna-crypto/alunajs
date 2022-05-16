import debug from 'debug'

import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaPositionListParams,
  IAlunaPositionListRawReturns,
} from '../../../../../lib/modules/authed/IAlunaPositionModule'
import { SampleHttp } from '../../../SampleHttp'
import { getSampleEndpoints } from '../../../sampleSpecs'
import { ISamplePositionSchema } from '../../../schemas/ISamplePositionSchema'



const log = debug('alunajs:sample/position/listRaw')



export const listRaw = (exchange: IAlunaExchangeAuthed) => async (
  params: IAlunaPositionListParams = {},
): Promise<IAlunaPositionListRawReturns<ISamplePositionSchema[]>> => {

  log('listing raw positions', params)

  const {
    settings,
    credentials,
  } = exchange

  const {
    http = new SampleHttp(settings),
  } = params

  const rawPositions = await http.authedRequest<ISamplePositionSchema[]>({
    credentials,
    url: getSampleEndpoints(settings).position.list,
  })

  const { requestWeight } = http

  return {
    rawPositions,
    requestWeight,
  }

}
