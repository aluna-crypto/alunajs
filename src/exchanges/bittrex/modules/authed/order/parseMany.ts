import { debug } from 'debug'

import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaOrderParseManyParams,
  IAlunaOrderParseManyReturns,
} from '../../../../../lib/modules/authed/IAlunaOrderModule'
import { IAlunaOrderSchema } from '../../../../../lib/schemas/IAlunaOrderSchema'
import { BittrexHttp } from '../../../BittrexHttp'
import { BITTREX_PRODUCTION_URL } from '../../../bittrexSpecs'



const log = debug('@aluna.js:bittrex/order/parseMany')



export const parseMany = (exchange: IAlunaExchangeAuthed) => async (
  params: IAlunaOrderParseManyParams,
): Promise<IAlunaOrderParseManyReturns> => {

  log('params', params)

  const { credentials } = exchange

  const { http = new BittrexHttp() } = params

  const orders = await http.authedRequest<IAlunaOrderSchema[]>({
    url: BITTREX_PRODUCTION_URL,
    credentials,
  })

  const { requestCount } = http

  return {
    orders,
    requestCount,
  }

}
