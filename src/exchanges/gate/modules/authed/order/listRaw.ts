import { debug } from 'debug'

import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import { AlunaHttpVerbEnum } from '../../../../../lib/enums/AlunaHtttpVerbEnum'
import {
  IAlunaOrderListParams,
  IAlunaOrderListRawReturns,
} from '../../../../../lib/modules/authed/IAlunaOrderModule'
import { GateHttp } from '../../../GateHttp'
import { getGateEndpoints } from '../../../gateSpecs'
import { IGateOrderListResponseSchema } from '../../../schemas/IGateOrderSchema'



const log = debug('alunajs:gate/order/listRaw')



export const listRaw = (exchange: IAlunaExchangeAuthed) => async (
  params: IAlunaOrderListParams = {},
): Promise<IAlunaOrderListRawReturns<IGateOrderListResponseSchema[]>> => {

  log('fetching Gate open orders', params)

  const {
    settings,
    credentials,
  } = exchange

  const { http = new GateHttp(settings) } = params

  const rawOrders = await http.authedRequest<IGateOrderListResponseSchema[]>({
    verb: AlunaHttpVerbEnum.GET,
    url: getGateEndpoints(settings).order.list,
    credentials,
  })

  const { requestWeight } = http

  return {
    rawOrders,
    requestWeight,
  }

}
