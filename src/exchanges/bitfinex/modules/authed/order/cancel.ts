import { debug } from 'debug'

import { AlunaError } from '../../../../../lib/core/AlunaError'
import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import { AlunaOrderErrorCodes } from '../../../../../lib/errors/AlunaOrderErrorCodes'
import {
  IAlunaOrderCancelParams,
  IAlunaOrderCancelReturns,
} from '../../../../../lib/modules/authed/IAlunaOrderModule'
import { BitfinexHttp } from '../../../BitfinexHttp'
import { getBitfinexEndpoints } from '../../../bitfinexSpecs'
import { BitfinexOrderStatusEnum } from '../../../enums/BitfinexOrderStatusEnum'
import { TBitfinexEditCancelOrderResponse } from '../../../schemas/IBitfinexOrderSchema'



const log = debug('@alunajs:bitfinex/order/cancel')



export const cancel = (exchange: IAlunaExchangeAuthed) => async (
  params: IAlunaOrderCancelParams,
): Promise<IAlunaOrderCancelReturns> => {

  log('canceling order', params)

  const {
    settings,
    credentials,
  } = exchange

  const {
    id,
    http = new BitfinexHttp(settings),
  } = params

  try {

    const response = await http.authedRequest<TBitfinexEditCancelOrderResponse>({
      url: getBitfinexEndpoints(settings).order.cancel,
      credentials,
      body: { id: Number(id) },
    })

    const [
      _mts,
      _type,
      _messageId,
      _placeHolder,
      canceledOrder, // Bitfinex do not return the order with canceled status
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

    canceledOrder[13] = BitfinexOrderStatusEnum.CANCELED

    const { order } = exchange.order.parse({ rawOrder: canceledOrder })

    const { requestWeight } = http

    return {
      order,
      requestWeight,
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
