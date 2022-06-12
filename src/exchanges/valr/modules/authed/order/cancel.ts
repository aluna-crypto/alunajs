import { debug } from 'debug'

import { AlunaError } from '../../../../../lib/core/AlunaError'
import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import { AlunaHttpVerbEnum } from '../../../../../lib/enums/AlunaHtttpVerbEnum'
import { AlunaOrderTypesEnum } from '../../../../../lib/enums/AlunaOrderTypesEnum'
import { AlunaOrderErrorCodes } from '../../../../../lib/errors/AlunaOrderErrorCodes'
import {
  IAlunaOrderCancelParams,
  IAlunaOrderCancelReturns,
} from '../../../../../lib/modules/authed/IAlunaOrderModule'
import { ValrOrderStatusEnum } from '../../../enums/ValrOrderStatusEnum'
import { IValrOrderGetResponseSchema } from '../../../schemas/IValrOrderSchema'
import { ValrHttp } from '../../../ValrHttp'
import { getValrEndpoints } from '../../../valrSpecs'



const log = debug('alunajs:valr/order/cancel')



export const cancel = (exchange: IAlunaExchangeAuthed) => async (
  params: IAlunaOrderCancelParams,
): Promise<IAlunaOrderCancelReturns> => {

  log('canceling order', params)

  const {
    settings,
    credentials,
  } = exchange

  const {
    http = new ValrHttp(settings),
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
      url: getValrEndpoints(settings).order.cancel,
      credentials,
      body,
    })

    const { rawOrder } = await exchange.order.getRaw({
      id,
      symbolPair,
      http,
      type: AlunaOrderTypesEnum.LIMIT,
    })

    const { valrOrder } = rawOrder as IValrOrderGetResponseSchema

    if (valrOrder.orderStatusType !== ValrOrderStatusEnum.CANCELLED) {

      const error = new AlunaError({
        httpStatusCode: 500,
        message: 'Something went wrong, order not canceled',
        code: AlunaOrderErrorCodes.CANCEL_FAILED,
        metadata: valrOrder,
      })

      throw error

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
