import { debug } from 'debug'

import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import { AlunaHttpVerbEnum } from '../../../../../lib/enums/AlunaHtttpVerbEnum'
import {
  IAlunaOrderListParams,
  IAlunaOrderListRawReturns,
} from '../../../../../lib/modules/authed/IAlunaOrderModule'
import { BittrexHttp } from '../../../BittrexHttp'
import { getBittrexEndpoints } from '../../../bittrexSpecs'
import { IBittrexOrderSchema } from '../../../schemas/IBittrexOrderSchema'



const log = debug('alunajs:bittrex/order/listRaw')



export const listRaw = (exchange: IAlunaExchangeAuthed) => async (
  params: IAlunaOrderListParams = {},
): Promise<IAlunaOrderListRawReturns<IBittrexOrderSchema[]>> => {

  log('fetching Bittrex open orders', params)

  const {
    settings,
    credentials,
  } = exchange

  const { http = new BittrexHttp(settings) } = params

  const rawOrders = await http.authedRequest<IBittrexOrderSchema[]>({
    verb: AlunaHttpVerbEnum.GET,
    url: getBittrexEndpoints(settings).order.list,
    credentials,
  })

  const { requestWeight } = http

  return {
    rawOrders,
    requestWeight,
  }

}
