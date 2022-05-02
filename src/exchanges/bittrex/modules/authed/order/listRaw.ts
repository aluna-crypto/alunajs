import { debug } from 'debug'

import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import { AlunaHttpVerbEnum } from '../../../../../lib/enums/AlunaHtttpVerbEnum'
import {
  IAlunaOrderListParams,
  IAlunaOrderListRawReturns,
} from '../../../../../lib/modules/authed/IAlunaOrderModule'
import { BittrexHttp } from '../../../BittrexHttp'
import { BITTREX_PRODUCTION_URL } from '../../../bittrexSpecs'
import { IBittrexOrderSchema } from '../../../schemas/IBittrexOrderSchema'



const log = debug('@aluna.js:bittrex/order/listRaw')



export const listRaw = (exchange: IAlunaExchangeAuthed) => async (
  params: IAlunaOrderListParams,
): Promise<IAlunaOrderListRawReturns<IBittrexOrderSchema>> => {

  log('fetching Bittrex open orders', params)

  const { credentials } = exchange

  const { http = new BittrexHttp() } = params

  const rawOrders = await http.authedRequest<IBittrexOrderSchema[]>({
    verb: AlunaHttpVerbEnum.GET,
    url: `${BITTREX_PRODUCTION_URL}/orders/open`,
    credentials,
  })

  const { requestCount } = http

  return {
    rawOrders,
    requestCount,
  }

}
