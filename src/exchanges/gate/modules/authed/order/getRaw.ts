import { debug } from 'debug'

import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import { AlunaHttpVerbEnum } from '../../../../../lib/enums/AlunaHtttpVerbEnum'
import {
  IAlunaOrderGetParams,
  IAlunaOrderGetRawReturns,
} from '../../../../../lib/modules/authed/IAlunaOrderModule'
import { GateHttp } from '../../../GateHttp'
import { getGateEndpoints } from '../../../gateSpecs'
import { IGateOrderSchema } from '../../../schemas/IGateOrderSchema'



const log = debug('@alunajs:gate/order/getRaw')



export const getRaw = (exchange: IAlunaExchangeAuthed) => async (
  params: IAlunaOrderGetParams,
): Promise<IAlunaOrderGetRawReturns<IGateOrderSchema>> => {

  log('getting raw order', params)

  const {
    settings,
    credentials,
  } = exchange

  const {
    id,
    symbolPair,
    http = new GateHttp(settings),
  } = params

  const query = new URLSearchParams()

  query.append('currency_pair', symbolPair)

  const rawOrder = await http.authedRequest<IGateOrderSchema>({
    credentials,
    verb: AlunaHttpVerbEnum.GET,
    url: getGateEndpoints(settings).order.get(id, query.toString()),
  })

  const { requestWeight } = http

  return {
    rawOrder,
    requestWeight,
  }

}
