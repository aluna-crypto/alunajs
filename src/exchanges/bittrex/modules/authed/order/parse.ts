import { debug } from 'debug'

import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaOrderParseParams,
  IAlunaOrderParseReturns,
} from '../../../../../lib/modules/authed/IAlunaOrderModule'
import { IAlunaOrderSchema } from '../../../../../lib/schemas/IAlunaOrderSchema'
import { BittrexHttp } from '../../../BittrexHttp'
import { BITTREX_PRODUCTION_URL } from '../../../bittrexSpecs'



const log = debug('@aluna.js:bittrex/order/parse')



export const parse = (exchange: IAlunaExchangeAuthed) => async (
  params: IAlunaOrderParseParams,
): Promise<IAlunaOrderParseReturns> => {

  log('params', params)

  const { credentials } = exchange

  const { http = new BittrexHttp() } = params

  const order = await http.authedRequest<IAlunaOrderSchema>({
    url: BITTREX_PRODUCTION_URL,
    credentials,
  })

  const { requestCount } = http

  return {
    order,
    requestCount,
  }

}
