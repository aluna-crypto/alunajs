import { debug } from 'debug'

import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import { AlunaHttpVerbEnum } from '../../../../../lib/enums/AlunaHtttpVerbEnum'
import {
  IAlunaOrderGetParams,
  IAlunaOrderGetRawReturns,
} from '../../../../../lib/modules/authed/IAlunaOrderModule'
import { SampleHttp } from '../../../SampleHttp'
import { sampleEndpoints } from '../../../sampleSpecs'
import { ISampleOrderSchema } from '../../../schemas/ISampleOrderSchema'



const log = debug('@alunajs:sample/order/getRaw')



export const getRaw = (exchange: IAlunaExchangeAuthed) => async (
  params: IAlunaOrderGetParams,
): Promise<IAlunaOrderGetRawReturns<ISampleOrderSchema>> => {

  log('params', params)

  const { credentials } = exchange

  const {
    id,
    http = new SampleHttp(),
  } = params

  // TODO: Implement proper request
  const rawOrder = await http.authedRequest<any>({
    credentials,
    verb: AlunaHttpVerbEnum.GET,
    url: sampleEndpoints.order.get(id),
  })

  const { requestCount } = http

  return {
    rawOrder,
    requestCount,
  }

}
