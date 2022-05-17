import { debug } from 'debug'

import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import { AlunaHttpVerbEnum } from '../../../../../lib/enums/AlunaHtttpVerbEnum'
import {
  IAlunaOrderGetParams,
  IAlunaOrderGetRawReturns,
} from '../../../../../lib/modules/authed/IAlunaOrderModule'
import { BitmexHttp } from '../../../BitmexHttp'
import { getBitmexEndpoints } from '../../../bitmexSpecs'
import {
  IBitmexOrder,
  IBitmexOrderSchema,
} from '../../../schemas/IBitmexOrderSchema'



const log = debug('alunajs:bitmex/order/getRaw')



export const getRaw = (exchange: IAlunaExchangeAuthed) => async (
  params: IAlunaOrderGetParams,
): Promise<IAlunaOrderGetRawReturns<IBitmexOrderSchema>> => {

  log('getting raw order', params)

  const {
    settings,
    credentials,
  } = exchange

  const {
    id,
    http = new BitmexHttp(settings),
  } = params

  const [bitmexOrder] = await http.authedRequest<IBitmexOrder[]>({
    credentials,
    verb: AlunaHttpVerbEnum.GET,
    url: getBitmexEndpoints(settings).order.get,
    body: { filter: { orderID: id } },
  })

  const { symbol } = bitmexOrder

  const { market } = await exchange.market.get!({
    symbolPair: symbol,
    http,
  })

  const rawOrder: IBitmexOrderSchema = {
    bitmexOrder,
    market,
  }

  const { requestWeight } = http

  return {
    rawOrder,
    requestWeight,
  }

}
