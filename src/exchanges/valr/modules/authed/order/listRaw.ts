import { debug } from 'debug'

import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import { AlunaHttpVerbEnum } from '../../../../../lib/enums/AlunaHtttpVerbEnum'
import {
  IAlunaOrderListParams,
  IAlunaOrderListRawReturns,
} from '../../../../../lib/modules/authed/IAlunaOrderModule'
import { ValrHttp } from '../../../ValrHttp'
import { valrEndpoints } from '../../../valrSpecs'
import { IValrOrderSchema } from '../../../schemas/IValrOrderSchema'



const log = debug('@alunajs:valr/order/listRaw')



export const listRaw = (exchange: IAlunaExchangeAuthed) => async (
  params: IAlunaOrderListParams = {},
): Promise<IAlunaOrderListRawReturns<IValrOrderSchema>> => {

  log('fetching Valr open orders', params)

  const { credentials } = exchange

  const { http = new ValrHttp() } = params

  // TODO: Implement proper request
  const rawOrders = await http.authedRequest<IValrOrderSchema[]>({
    verb: AlunaHttpVerbEnum.GET,
    url: valrEndpoints.order.list,
    credentials,
  })

  const { requestCount } = http

  return {
    rawOrders,
    requestCount,
  }

}
