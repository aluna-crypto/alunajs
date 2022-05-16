import { debug } from 'debug'

import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaOrderListParams,
  IAlunaOrderListRawReturns,
} from '../../../../../lib/modules/authed/IAlunaOrderModule'
import { PoloniexHttp } from '../../../PoloniexHttp'
import { getPoloniexEndpoints } from '../../../poloniexSpecs'
import { IPoloniexOrderResponseSchema } from '../../../schemas/IPoloniexOrderSchema'



const log = debug('alunajs:poloniex/order/listRaw')



export const listRaw = (exchange: IAlunaExchangeAuthed) => async (
  params: IAlunaOrderListParams = {},
): Promise<IAlunaOrderListRawReturns<IPoloniexOrderResponseSchema>> => {

  log('fetching Poloniex open orders', params)

  const {
    settings,
    credentials,
  } = exchange

  const { http = new PoloniexHttp(settings) } = params

  const timestamp = new Date().getTime()
  const searchParams = new URLSearchParams()

  searchParams.append('command', 'returnOpenOrders')
  searchParams.append('currencyPair', 'all')
  searchParams.append('nonce', timestamp.toString())

  const rawOrders = await http.authedRequest<IPoloniexOrderResponseSchema>({
    url: getPoloniexEndpoints(settings).order.list,
    credentials,
    body: searchParams,
  })

  const { requestWeight } = http

  return {
    rawOrders,
    requestWeight,
  }

}
