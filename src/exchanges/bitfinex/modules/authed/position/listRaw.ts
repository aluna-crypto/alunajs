import debug from 'debug'

import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaPositionListParams,
  IAlunaPositionListRawReturns,
} from '../../../../../lib/modules/authed/IAlunaPositionModule'
import { BitfinexHttp } from '../../../BitfinexHttp'
import { getBitfinexEndpoints } from '../../../bitfinexSpecs'
import { IBitfinexPositionSchema } from '../../../schemas/IBitfinexPositionSchema'



const log = debug('@alunajs:bitfinex/position/listRaw')



export const listRaw = (exchange: IAlunaExchangeAuthed) => async (
  params: IAlunaPositionListParams = {},
): Promise<IAlunaPositionListRawReturns<IBitfinexPositionSchema[]>> => {

  log('listing raw positions', params)

  const {
    settings,
    credentials,
  } = exchange

  const {
    http = new BitfinexHttp(settings),
  } = params

  const rawPositions = await http.authedRequest<IBitfinexPositionSchema[]>({
    credentials,
    url: getBitfinexEndpoints(settings).position.list,
  })

  const { requestCount } = http

  return {
    rawPositions,
    requestCount,
  }

}
