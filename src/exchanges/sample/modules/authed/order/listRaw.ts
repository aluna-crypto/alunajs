import { debug } from 'debug'

import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import { AlunaHttpVerbEnum } from '../../../../../lib/enums/AlunaHtttpVerbEnum'
import {
  IAlunaOrderListParams,
  IAlunaOrderListRawReturns,
} from '../../../../../lib/modules/authed/IAlunaOrderModule'
import { SampleHttp } from '../../../SampleHttp'
import { sampleEndpoints } from '../../../sampleSpecs'
import { ISampleOrderSchema } from '../../../schemas/ISampleOrderSchema'



const log = debug('@alunajs:sample/order/listRaw')



export const listRaw = (exchange: IAlunaExchangeAuthed) => async (
  params: IAlunaOrderListParams = {},
): Promise<IAlunaOrderListRawReturns<ISampleOrderSchema>> => {

  log('fetching Sample open orders', params)

  const { credentials } = exchange

  const { http = new SampleHttp() } = params

  // TODO: Implement proper request
  const rawOrders = await http.authedRequest<ISampleOrderSchema[]>({
    verb: AlunaHttpVerbEnum.GET,
    url: sampleEndpoints.order.list,
    credentials,
  })

  const { requestCount } = http

  return {
    rawOrders,
    requestCount,
  }

}
