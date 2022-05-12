import { debug } from 'debug'

import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import { AlunaHttpVerbEnum } from '../../../../../lib/enums/AlunaHtttpVerbEnum'
import {
  IAlunaOrderListParams,
  IAlunaOrderListRawReturns,
} from '../../../../../lib/modules/authed/IAlunaOrderModule'
import { BitmexHttp } from '../../../BitmexHttp'
import { getBitmexEndpoints } from '../../../bitmexSpecs'
import {
  IBitmexOrder,
  IBitmexOrdersSchema,
} from '../../../schemas/IBitmexOrderSchema'



const log = debug('@alunajs:bitmex/order/listRaw')



export const listRaw = (exchange: IAlunaExchangeAuthed) => async (
  params: IAlunaOrderListParams = {},
): Promise<IAlunaOrderListRawReturns<IBitmexOrdersSchema>> => {

  log('fetching Bitmex open orders', params)

  const {
    settings,
    credentials,
  } = exchange

  const { http = new BitmexHttp(settings) } = params

  const bitmexOrders = await http.authedRequest<IBitmexOrder[]>({
    verb: AlunaHttpVerbEnum.GET,
    url: getBitmexEndpoints(settings).order.list,
    credentials,
    body: { filter: { open: true } },
  })

  const { markets } = await exchange.market.list({ http })

  const { requestWeight } = http

  const rawOrders: IBitmexOrdersSchema = {
    bitmexOrders,
    markets,
  }

  return {
    rawOrders,
    requestWeight,
  }

}
