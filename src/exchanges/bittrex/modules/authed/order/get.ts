import { debug } from 'debug'

import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaOrderGetParams,
  IAlunaOrderGetReturns,
} from '../../../../../lib/modules/authed/IAlunaOrderModule'



const log = debug('@aluna.js:bittrex/order/get')



export const get = (exchange: IAlunaExchangeAuthed) => async (
  params: IAlunaOrderGetParams,
): Promise<IAlunaOrderGetReturns> => {

  log('params', params)

  const {
    rawOrder,
    requestCount,
  } = await exchange.order.getRaw(params)

  const { order } = exchange.order.parse({ rawOrder })

  return {
    order,
    requestCount,
  }

}
