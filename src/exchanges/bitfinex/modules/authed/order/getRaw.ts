import { debug } from 'debug'

import { AlunaError } from '../../../../../lib/core/AlunaError'
import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import { AlunaOrderErrorCodes } from '../../../../../lib/errors/AlunaOrderErrorCodes'
import {
  IAlunaOrderGetParams,
  IAlunaOrderGetRawReturns,
} from '../../../../../lib/modules/authed/IAlunaOrderModule'
import { BitfinexHttp } from '../../../BitfinexHttp'
import { bitfinexEndpoints } from '../../../bitfinexSpecs'
import { IBitfinexOrderSchema } from '../../../schemas/IBitfinexOrderSchema'



const log = debug('@alunajs:bitfinex/order/getRaw')



export const getRaw = (exchange: IAlunaExchangeAuthed) => async (
  params: IAlunaOrderGetParams,
): Promise<IAlunaOrderGetRawReturns<IBitfinexOrderSchema>> => {

  log('params', params)

  const { credentials } = exchange

  const {
    id: stringId,
    symbolPair,
    http = new BitfinexHttp(),
  } = params

  const id = Number(stringId)

  let orders = await http.authedRequest<IBitfinexOrderSchema[]>({
    credentials,
    url: bitfinexEndpoints.order.get(symbolPair),
    body: { id: [id] },
  })

  if (!orders.length) {

    orders = await http.authedRequest<IBitfinexOrderSchema[]>({
      credentials,
      url: bitfinexEndpoints.order.getHistory(symbolPair),
      body: { id: [id] },
    })

    if (!orders.length) {

      const error = new AlunaError({
        code: AlunaOrderErrorCodes.NOT_FOUND,
        message: 'Order was not found.',
        metadata: params,
      })

      log(error)

      throw error

    }

  }

  const [rawOrder] = orders

  const { requestCount } = http

  return {
    rawOrder,
    requestCount,
  }

}
