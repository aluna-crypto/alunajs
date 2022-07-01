import { debug } from 'debug'

import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import { AlunaHttpVerbEnum } from '../../../../../lib/enums/AlunaHtttpVerbEnum'
import {
  IAlunaOrderListParams,
  IAlunaOrderListRawReturns,
} from '../../../../../lib/modules/authed/IAlunaOrderModule'
import { HuobiHttp } from '../../../HuobiHttp'
import { getHuobiEndpoints } from '../../../huobiSpecs'
import {
  IHuobiConditionalOrderSchema,
  IHuobiOrderSchema,
  IHuobiOrdersResponseSchema,
} from '../../../schemas/IHuobiOrderSchema'



const log = debug('alunajs:huobi/order/listRaw')



export const listRaw = (exchange: IAlunaExchangeAuthed) => async (
  params: IAlunaOrderListParams = {},
): Promise<IAlunaOrderListRawReturns<IHuobiOrdersResponseSchema>> => {

  log('fetching Huobi open orders', params)

  const {
    settings,
    credentials,
  } = exchange

  const { http = new HuobiHttp(settings) } = params

  const huobiOrders = await http.authedRequest<IHuobiOrderSchema[]>({
    verb: AlunaHttpVerbEnum.GET,
    url: getHuobiEndpoints(settings).order.list,
    credentials,
  })

  const huobiConditionalOrders = await http.authedRequest<IHuobiConditionalOrderSchema[]>({
    verb: AlunaHttpVerbEnum.GET,
    url: getHuobiEndpoints(settings).order.listConditional,
    credentials,
  })

  const { rawSymbols } = await exchange.symbol.listRaw({
    http,
  })

  const { requestWeight } = http

  const rawOrders: IHuobiOrdersResponseSchema = {
    huobiOrders: [...huobiOrders, ...huobiConditionalOrders],
    rawSymbols,
  }

  return {
    rawOrders,
    requestWeight,
  }

}
