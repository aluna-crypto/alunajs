import { debug } from 'debug'

import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import { AlunaHttpVerbEnum } from '../../../../../lib/enums/AlunaHtttpVerbEnum'
import {
  IAlunaOrderGetParams,
  IAlunaOrderGetRawReturns,
} from '../../../../../lib/modules/authed/IAlunaOrderModule'
import { ValrHttp } from '../../../ValrHttp'
import { valrEndpoints } from '../../../valrSpecs'
import { IValrOrderSchema } from '../../../schemas/IValrOrderSchema'



const log = debug('@alunajs:valr/order/getRaw')



export const getRaw = (exchange: IAlunaExchangeAuthed) => async (
  params: IAlunaOrderGetParams,
): Promise<IAlunaOrderGetRawReturns<IValrOrderSchema>> => {

  log('params', params)

  const { credentials } = exchange

  const {
    id,
    symbolPair,
    http = new ValrHttp(),
  } = params

  // TODO: Implement proper request
  const rawOrder = await http.authedRequest<any>({
    credentials,
    verb: AlunaHttpVerbEnum.GET,
    url: valrEndpoints.order.get(id, symbolPair),
  })

  const { requestCount } = http

  return {
    rawOrder,
    requestCount,
  }

}
