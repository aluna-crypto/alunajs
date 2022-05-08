import debug from 'debug'

import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaPositionListParams,
  IAlunaPositionListRawReturns,
} from '../../../../../lib/modules/authed/IAlunaPositionModule'
import { BitfinexHttp } from '../../../BitfinexHttp'
import { bitfinexEndpoints } from '../../../bitfinexSpecs'
import { IBitfinexPositionSchema } from '../../../schemas/IBitfinexPositionSchema'



const log = debug('@alunajs:bitfinex/position/listRaw')



export const listRaw = (exchange: IAlunaExchangeAuthed) => async (
  params: IAlunaPositionListParams = {},
): Promise<IAlunaPositionListRawReturns<IBitfinexPositionSchema[]>> => {

  log('listing raw positions', params)

  const {
    http = new BitfinexHttp(exchange.settings),
  } = params

  const { credentials } = exchange

  const rawPositions = await http.authedRequest<IBitfinexPositionSchema[]>({
    credentials,
    url: bitfinexEndpoints.position.list,
  })

  const { requestCount } = http

  return {
    rawPositions,
    requestCount,
  }

}
