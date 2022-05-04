import { debug } from 'debug'

import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import { AlunaHttpVerbEnum } from '../../../../../lib/enums/AlunaHtttpVerbEnum'
import {
  IAlunaOrderGetParams,
  IAlunaOrderGetRawReturns,
} from '../../../../../lib/modules/authed/IAlunaOrderModule'
import { BittrexHttp } from '../../../BittrexHttp'
import { BITTREX_PRODUCTION_URL } from '../../../bittrexSpecs'
import { IBittrexOrderSchema } from '../../../schemas/IBittrexOrderSchema'



const log = debug('@alunajs:bittrex/order/getRaw')



export const getRaw = (exchange: IAlunaExchangeAuthed) => async (
  params: IAlunaOrderGetParams,
): Promise<IAlunaOrderGetRawReturns<IBittrexOrderSchema>> => {

  log('params', params)

  const { credentials } = exchange

  const {
    id,
    http = new BittrexHttp(),
  } = params

  const rawOrder = await http.authedRequest<any>({
    credentials,
    verb: AlunaHttpVerbEnum.GET,
    url: `${BITTREX_PRODUCTION_URL}/orders/${id}`,
  })

  const { requestCount } = http

  return {
    rawOrder,
    requestCount,
  }

}
