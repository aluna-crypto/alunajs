import debug from 'debug'

import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaPositionListParams,
  IAlunaPositionListRawReturns,
} from '../../../../../lib/modules/authed/IAlunaPositionModule'
import { BitmexHttp } from '../../../BitmexHttp'
import { getBitmexEndpoints } from '../../../bitmexSpecs'
import { IBitmexPositionSchema } from '../../../schemas/IBitmexPositionSchema'



const log = debug('@alunajs:bitmex/position/listRaw')



export const listRaw = (exchange: IAlunaExchangeAuthed) => async (
  params: IAlunaPositionListParams = {},
): Promise<IAlunaPositionListRawReturns<IBitmexPositionSchema[]>> => {

  log('listing raw positions', params)

  const {
    settings,
    credentials,
  } = exchange

  const {
    http = new BitmexHttp(settings),
  } = params

  const rawPositions = await http.authedRequest<IBitmexPositionSchema[]>({
    credentials,
    url: getBitmexEndpoints(settings).position.list,
  })

  const { requestWeight } = http

  return {
    rawPositions,
    requestWeight,
  }

}
