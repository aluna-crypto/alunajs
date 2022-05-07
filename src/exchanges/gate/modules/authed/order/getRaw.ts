import { debug } from 'debug'

import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import { AlunaHttpVerbEnum } from '../../../../../lib/enums/AlunaHtttpVerbEnum'
import {
  IAlunaOrderGetParams,
  IAlunaOrderGetRawReturns,
} from '../../../../../lib/modules/authed/IAlunaOrderModule'
import { GateHttp } from '../../../GateHttp'
import { gateEndpoints } from '../../../gateSpecs'
import { IGateOrderSchema } from '../../../schemas/IGateOrderSchema'



const log = debug('@alunajs:gate/order/getRaw')



export const getRaw = (exchange: IAlunaExchangeAuthed) => async (
  params: IAlunaOrderGetParams,
): Promise<IAlunaOrderGetRawReturns<IGateOrderSchema>> => {

  log('getting raw order', params)

  const { credentials } = exchange

  const {
    id,
    http = new GateHttp(),
  } = params

  // TODO: Implement proper request
  const rawOrder = await http.authedRequest<any>({
    credentials,
    verb: AlunaHttpVerbEnum.GET,
    url: gateEndpoints.order.get(id, ''),
  })

  const { requestCount } = http

  return {
    rawOrder,
    requestCount,
  }

}
