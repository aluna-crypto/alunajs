import { debug } from 'debug'

import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import { AlunaHttpVerbEnum } from '../../../../../lib/enums/AlunaHtttpVerbEnum'
import {
  IAlunaOrderListParams,
  IAlunaOrderListRawReturns,
} from '../../../../../lib/modules/authed/IAlunaOrderModule'
import { SampleHttp } from '../../../SampleHttp'
import { getSampleEndpoints } from '../../../sampleSpecs'
import { ISampleOrderSchema } from '../../../schemas/ISampleOrderSchema'



const log = debug('@alunajs:sample/order/listRaw')



export const listRaw = (exchange: IAlunaExchangeAuthed) => async (
  params: IAlunaOrderListParams = {},
): Promise<IAlunaOrderListRawReturns<ISampleOrderSchema[]>> => {

  log('fetching Sample open orders', params)

  const {
    settings,
    credentials,
  } = exchange

  const { http = new SampleHttp(settings) } = params

  // TODO: Implement proper request
  const rawOrders = await http.authedRequest<ISampleOrderSchema[]>({
    verb: AlunaHttpVerbEnum.GET,
    url: getSampleEndpoints(settings).order.list,
    credentials,
  })

  const { requestCount } = http

  return {
    rawOrders,
    requestCount,
  }

}
