import { debug } from 'debug'

import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import { AlunaHttpVerbEnum } from '../../../../../lib/enums/AlunaHtttpVerbEnum'
import {
  IAlunaOrderListParams,
  IAlunaOrderListRawReturns,
} from '../../../../../lib/modules/authed/IAlunaOrderModule'
import { BitmexHttp } from '../../../BitmexHttp'
import { getBitmexEndpoints } from '../../../bitmexSpecs'
import { IBitmexOrderSchema } from '../../../schemas/IBitmexOrderSchema'



const log = debug('@alunajs:bitmex/order/listRaw')



export const listRaw = (exchange: IAlunaExchangeAuthed) => async (
  params: IAlunaOrderListParams = {},
): Promise<IAlunaOrderListRawReturns<IBitmexOrderSchema[]>> => {

  log('fetching Bitmex open orders', params)

  const {
    settings,
    credentials,
  } = exchange

  const { http = new BitmexHttp(settings) } = params

  // TODO: Implement proper request
  const rawOrders = await http.authedRequest<IBitmexOrderSchema[]>({
    verb: AlunaHttpVerbEnum.GET,
    url: getBitmexEndpoints(settings).order.list,
    credentials,
  })

  const { requestWeight } = http

  return {
    rawOrders,
    requestWeight,
  }

}
