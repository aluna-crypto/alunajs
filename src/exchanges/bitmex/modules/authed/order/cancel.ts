import { debug } from 'debug'

import { AlunaError } from '../../../../../lib/core/AlunaError'
import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import { AlunaHttpVerbEnum } from '../../../../../lib/enums/AlunaHtttpVerbEnum'
import { AlunaOrderErrorCodes } from '../../../../../lib/errors/AlunaOrderErrorCodes'
import {
  IAlunaOrderCancelParams,
  IAlunaOrderCancelReturns,
} from '../../../../../lib/modules/authed/IAlunaOrderModule'
import { BitmexHttp } from '../../../BitmexHttp'
import { getBitmexEndpoints } from '../../../bitmexSpecs'
import {
  IBitmexOrder,
  IBitmexOrderSchema,
} from '../../../schemas/IBitmexOrderSchema'



const log = debug('@alunajs:bitmex/order/cancel')
export interface IErrorResponse {
  error: string
}



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
    http = new BitmexHttp(settings),
  } = params

  try {

    const [cancelOrderResponse] = await http.authedRequest<Array<IBitmexOrder | IErrorResponse>>({
      verb: AlunaHttpVerbEnum.DELETE,
      url: getBitmexEndpoints(settings).order.cancel,
      body: { orderID: id },
      credentials,
    })

    if ((cancelOrderResponse as IErrorResponse).error!) {

      const { error } = cancelOrderResponse as IErrorResponse

      const alunaError = new AlunaError({
        code: AlunaOrderErrorCodes.CANCEL_FAILED,
        message: error,
        metadata: error,
      })

      throw alunaError

    }

    const bitmexOrder = cancelOrderResponse as IBitmexOrder

    const { market } = await exchange.market.get!({
      http,
      symbolPair: bitmexOrder.symbol,
    })

    const rawOrder: IBitmexOrderSchema = {
      market,
      bitmexOrder,
    }

    const { order } = exchange.order.parse({ rawOrder })

    const { requestWeight } = http

    return {
      order,
      requestWeight,
    }

  } catch (err) {

    const {
      metadata,
      message,
      httpStatusCode,
    } = err


    let code = AlunaOrderErrorCodes.CANCEL_FAILED

    if (/Invalid orderID/.test(message)) {

      code = AlunaOrderErrorCodes.NOT_FOUND

    }

    const error = new AlunaError({
      message,
      httpStatusCode,
      code,
      metadata,
    })

    log(error)

    throw error

  }

}
