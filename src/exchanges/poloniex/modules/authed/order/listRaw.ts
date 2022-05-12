import { debug } from 'debug'

import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import { AlunaHttpVerbEnum } from '../../../../../lib/enums/AlunaHtttpVerbEnum'
import {
  IAlunaOrderListParams,
  IAlunaOrderListRawReturns,
} from '../../../../../lib/modules/authed/IAlunaOrderModule'
import { PoloniexHttp } from '../../../PoloniexHttp'
import { getPoloniexEndpoints } from '../../../poloniexSpecs'
import { IPoloniexOrderSchema } from '../../../schemas/IPoloniexOrderSchema'



const log = debug('@alunajs:poloniex/order/listRaw')



export const listRaw = (exchange: IAlunaExchangeAuthed) => async (
  params: IAlunaOrderListParams = {},
): Promise<IAlunaOrderListRawReturns<IPoloniexOrderSchema[]>> => {

  log('fetching Poloniex open orders', params)

  const {
    settings,
    credentials,
  } = exchange

  const { http = new PoloniexHttp(settings) } = params

  // TODO: Implement proper request
  const rawOrders = await http.authedRequest<IPoloniexOrderSchema[]>({
    verb: AlunaHttpVerbEnum.GET,
    url: getPoloniexEndpoints(settings).order.list,
    credentials,
  })

  const { requestWeight } = http

  return {
    rawOrders,
    requestWeight,
  }

}
