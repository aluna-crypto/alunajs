import { debug } from 'debug'

import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import { AlunaHttpVerbEnum } from '../../../../../lib/enums/AlunaHtttpVerbEnum'
import {
  IAlunaOrderGetParams,
  IAlunaOrderGetRawReturns,
} from '../../../../../lib/modules/authed/IAlunaOrderModule'
import { BitfinexHttp } from '../../../BitfinexHttp'
import { bitfinexEndpoints } from '../../../bitfinexSpecs'
import { IBitfinexOrderSchema } from '../../../schemas/IBitfinexOrderSchema'



const log = debug('@alunajs:bitfinex/order/getRaw')



export const getRaw = (exchange: IAlunaExchangeAuthed) => async (
  params: IAlunaOrderGetParams,
): Promise<IAlunaOrderGetRawReturns<IBitfinexOrderSchema>> => {

  log('params', params)

  const { credentials } = exchange

  const {
    id,
    http = new BitfinexHttp(),
  } = params

  // TODO: Implement proper request
  const rawOrder = await http.authedRequest<any>({
    credentials,
    verb: AlunaHttpVerbEnum.GET,
    url: bitfinexEndpoints.order.get(id),
  })

  const { requestCount } = http

  return {
    rawOrder,
    requestCount,
  }

}
