import debug from 'debug'

import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaPositionListParams,
  IAlunaPositionListRawReturns,
} from '../../../../../lib/modules/authed/IAlunaPositionModule'
import { OkxHttp } from '../../../OkxHttp'
import { getOkxEndpoints } from '../../../okxSpecs'
import { IOkxPositionSchema } from '../../../schemas/IOkxPositionSchema'



const log = debug('alunajs:okx/position/listRaw')



export const listRaw = (exchange: IAlunaExchangeAuthed) => async (
  params: IAlunaPositionListParams = {},
): Promise<IAlunaPositionListRawReturns<IOkxPositionSchema[]>> => {

  log('listing raw positions', params)

  const {
    settings,
    credentials,
  } = exchange

  const {
    http = new OkxHttp(settings),
  } = params

  const rawPositions = await http.authedRequest<IOkxPositionSchema[]>({
    credentials,
    url: getOkxEndpoints(settings).position.list,
  })

  const { requestWeight } = http

  return {
    rawPositions,
    requestWeight,
  }

}
