import { debug } from 'debug'

import { AlunaError } from '../../../../../lib/core/AlunaError'
import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import { AlunaOrderErrorCodes } from '../../../../../lib/errors/AlunaOrderErrorCodes'
import {
  IAlunaOrderGetParams,
  IAlunaOrderGetRawReturns,
} from '../../../../../lib/modules/authed/IAlunaOrderModule'
import { BitfinexHttp } from '../../../BitfinexHttp'
import { getBitfinexEndpoints } from '../../../bitfinexSpecs'
import { IBitfinexOrderSchema } from '../../../schemas/IBitfinexOrderSchema'



const log = debug('@alunajs:bitfinex/order/getRaw')



export const getRaw = (exchange: IAlunaExchangeAuthed) => async (
  params: IAlunaOrderGetParams,
): Promise<IAlunaOrderGetRawReturns<IBitfinexOrderSchema>> => {

  log('getting raw order', params)

  const {
    settings,
    credentials,
  } = exchange

  const {
    id: stringId,
    symbolPair,
    http = new BitfinexHttp(settings),
  } = params

  const id = Number(stringId)

  let orders = await http.authedRequest<IBitfinexOrderSchema[]>({
    credentials,
    url: getBitfinexEndpoints(settings).order.get(symbolPair),
    body: { id: [id] },
  })

  if (!orders.length) {

    orders = await http.authedRequest<IBitfinexOrderSchema[]>({
      credentials,
      url: getBitfinexEndpoints(settings).order.getHistory(symbolPair),
      body: { id: [id] },
    })

    if (!orders.length) {

      const error = new AlunaError({
        code: AlunaOrderErrorCodes.NOT_FOUND,
        message: 'Order was not found.',
      })

      log(error)

      throw error

    }

  }

  const [rawOrder] = orders

  const { requestWeight } = http

  return {
    rawOrder,
    requestWeight,
  }

}
