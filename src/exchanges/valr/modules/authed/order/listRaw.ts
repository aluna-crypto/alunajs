import { debug } from 'debug'

import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import { AlunaHttpVerbEnum } from '../../../../../lib/enums/AlunaHtttpVerbEnum'
import {
  IAlunaOrderListParams,
  IAlunaOrderListRawReturns,
} from '../../../../../lib/modules/authed/IAlunaOrderModule'
import { IValrMarketCurrencyPairs } from '../../../schemas/IValrMarketSchema'
import {
  IValrOrderListResponseSchema,
  IValrOrderListSchema,
} from '../../../schemas/IValrOrderSchema'
import { ValrHttp } from '../../../ValrHttp'
import { valrEndpoints } from '../../../valrSpecs'



const log = debug('@alunajs:valr/order/listRaw')



export const listRaw = (exchange: IAlunaExchangeAuthed) => async (
  params: IAlunaOrderListParams = {},
): Promise<IAlunaOrderListRawReturns<IValrOrderListResponseSchema>> => {

  log('fetching Valr open orders', params)

  const { credentials } = exchange

  const { http = new ValrHttp(exchange.settings) } = params

  const rawOrders = await http.authedRequest<IValrOrderListSchema[]>({
    verb: AlunaHttpVerbEnum.GET,
    url: valrEndpoints.order.list,
    credentials,
  })

  const pairs = await http.publicRequest<IValrMarketCurrencyPairs[]>({
    url: valrEndpoints.market.pairs,
  })

  const rawOrdersResponse: IValrOrderListResponseSchema = {
    orders: rawOrders,
    pairs,
  }

  const { requestCount } = http

  return {
    rawOrders: rawOrdersResponse,
    requestCount,
  }

}
