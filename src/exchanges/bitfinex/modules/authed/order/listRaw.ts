import { debug } from 'debug'

import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaOrderListParams,
  IAlunaOrderListRawReturns,
} from '../../../../../lib/modules/authed/IAlunaOrderModule'
import { BitfinexHttp } from '../../../BitfinexHttp'
import { getBitfinexEndpoints } from '../../../bitfinexSpecs'
import { IBitfinexOrderSchema } from '../../../schemas/IBitfinexOrderSchema'



const log = debug('alunajs:bitfinex/order/listRaw')



export const listRaw = (exchange: IAlunaExchangeAuthed) => async (
  params: IAlunaOrderListParams = {},
): Promise<IAlunaOrderListRawReturns<IBitfinexOrderSchema[]>> => {

  log('fetching Bitfinex open orders', params)

  const {
    settings,
    credentials,
  } = exchange

  const { http = new BitfinexHttp(settings) } = params

  const rawOrders = await http.authedRequest<IBitfinexOrderSchema[]>({
    url: getBitfinexEndpoints(settings).order.list,
    credentials,
  })

  const { requestWeight } = http

  return {
    rawOrders,
    requestWeight,
  }

}
