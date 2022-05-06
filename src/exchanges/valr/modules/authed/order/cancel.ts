import { debug } from 'debug'

import { AlunaError } from '../../../../../lib/core/AlunaError'
import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import { AlunaHttpVerbEnum } from '../../../../../lib/enums/AlunaHtttpVerbEnum'
import { AlunaOrderErrorCodes } from '../../../../../lib/errors/AlunaOrderErrorCodes'
import {
  IAlunaOrderCancelParams,
  IAlunaOrderCancelReturns,
} from '../../../../../lib/modules/authed/IAlunaOrderModule'
import { ValrHttp } from '../../../ValrHttp'
import { valrEndpoints } from '../../../valrSpecs'
import { ValrOrderStatusEnum } from '../../../enums/ValrOrderStatusEnum'



const log = debug('@alunajs:valr/order/cancel')



export const cancel = (exchange: IAlunaExchangeAuthed) => async (
  params: IAlunaOrderCancelParams,
): Promise<IAlunaOrderCancelReturns> => {

  log('params', params)

  const { credentials } = exchange

  const {
    http = new ValrHttp(),
    id,
    symbolPair,
  } = params

  const body = {
    orderId: id,
    pair: symbolPair,
  }

  try {

    await http.authedRequest<void>({
      verb: AlunaHttpVerbEnum.DELETE,
      url: valrEndpoints.order.cancel,
      credentials,
      body,
    })

    const { rawOrder } = await exchange.order.getRaw({
      id,
      symbolPair,
      http,
    })


    if (rawOrder.orderStatusType !== ValrOrderStatusEnum.CANCELLED) {

      const error = new AlunaError({
        httpStatusCode: 500,
        message: 'Something went wrong, order not canceled',
        code: AlunaOrderErrorCodes.CANCEL_FAILED,
        metadata: rawOrder,
      })

      throw error

    }

    const { order } = exchange.order.parse({ rawOrder })

    const { requestCount } = http

    return {
      order,
      requestCount,
    }

  } catch (err) {

    const {
      metadata,
      httpStatusCode,
    } = err

    const error = new AlunaError({
      message: 'Something went wrong, order not canceled',
      httpStatusCode,
      code: AlunaOrderErrorCodes.CANCEL_FAILED,
      metadata,
    })

    log(error)

    throw error

  }

}
