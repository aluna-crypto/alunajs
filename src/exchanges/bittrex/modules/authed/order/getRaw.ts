import { debug } from 'debug'

import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import { AlunaHttpVerbEnum } from '../../../../../lib/enums/AlunaHtttpVerbEnum'
import {
  IAlunaOrderGetParams,
  IAlunaOrderGetRawReturns,
} from '../../../../../lib/modules/authed/IAlunaOrderModule'
import { BittrexHttp } from '../../../BittrexHttp'
import { bittrexEndpoints } from '../../../bittrexSpecs'
import { IBittrexOrderSchema } from '../../../schemas/IBittrexOrderSchema'



const log = debug('@alunajs:bittrex/order/getRaw')



export const getRaw = (exchange: IAlunaExchangeAuthed) => async (
  params: IAlunaOrderGetParams,
): Promise<IAlunaOrderGetRawReturns<IBittrexOrderSchema>> => {

  log('getting raw order', params)

  const { credentials } = exchange

  const {
    id,
    http = new BittrexHttp(),
  } = params

  const rawOrder = await http.authedRequest<any>({
    credentials,
    verb: AlunaHttpVerbEnum.GET,
    url: bittrexEndpoints.order.get(id),
  })

  const { requestCount } = http

  return {
    rawOrder,
    requestCount,
  }

}
