import { debug } from 'debug'

import { AlunaError } from '../../../../../lib/core/AlunaError'
import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import { AlunaOrderErrorCodes } from '../../../../../lib/errors/AlunaOrderErrorCodes'
import {
  IAlunaOrderCancelParams,
  IAlunaOrderCancelReturns,
} from '../../../../../lib/modules/authed/IAlunaOrderModule'
import { BitfinexHttp } from '../../../BitfinexHttp'
import { bitfinexEndpoints } from '../../../bitfinexSpecs'
import { TBitfinexEditCancelOrderResponse } from '../../../schemas/IBitfinexOrderSchema'



const log = debug('@alunajs:bitfinex/order/cancel')



export const cancel = (exchange: IAlunaExchangeAuthed) => async (
  params: IAlunaOrderCancelParams,
): Promise<IAlunaOrderCancelReturns> => {

  log('params', params)

  const { credentials } = exchange

  const {
    id,
    symbolPair,
    http = new BitfinexHttp(),
  } = params

  try {

    const response = await http.authedRequest<TBitfinexEditCancelOrderResponse>({
      url: bitfinexEndpoints.order.cancel,
      credentials,
      body: { id: Number(id) },
    })

    const [
      _mts,
      _type,
      _messageId,
      _placeHolder,
      _canceledOrder, // Bitfinex do not return the order with canceled status
      _code,
      status,
      text,
    ] = response

    if (status !== 'SUCCESS') {

      throw new AlunaError({
        code: AlunaOrderErrorCodes.CANCEL_FAILED,
        message: text,
        metadata: response,
        httpStatusCode: 500,
      })

    }

    const { order } = await exchange.order.get({
      id,
      symbolPair,
      http,
    })

    const { requestCount } = http

    return {
      order,
      requestCount,
    }

  } catch (err) {

    const error = new AlunaError({
      message: err.message,
      code: AlunaOrderErrorCodes.CANCEL_FAILED,
      metadata: err.metadata,
      httpStatusCode: err.httpStatusCode,
    })

    log(error)

    throw error

  }

}
