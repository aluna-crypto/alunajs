import { debug } from 'debug'

import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaOrderListParams,
  IAlunaOrderListRawReturns,
} from '../../../../../lib/modules/authed/IAlunaOrderModule'
import { BittrexHttp } from '../../../BittrexHttp'
import { BITTREX_PRODUCTION_URL } from '../../../bittrexSpecs'



const log = debug('@aluna.js:bittrex/order/listRaw')



// TODO: replace all generic types <any>

export const listRaw = (exchange: IAlunaExchangeAuthed) => async (
  params: IAlunaOrderListParams,
): Promise<IAlunaOrderListRawReturns<any>> => {

  log('params', params)

  const { credentials } = exchange

  const { http = new BittrexHttp() } = params

  const rawOrders = await http.authedRequest<any[]>({
    url: BITTREX_PRODUCTION_URL,
    credentials,
  })

  const { requestCount } = http

  return {
    rawOrders,
    requestCount,
  }

}
