import { debug } from 'debug'

import { AlunaError } from '../../../../../lib/core/AlunaError'
import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import { AlunaHttpVerbEnum } from '../../../../../lib/enums/AlunaHtttpVerbEnum'
import { AlunaOrderErrorCodes } from '../../../../../lib/errors/AlunaOrderErrorCodes'
import {
  IAlunaOrderCancelParams,
  IAlunaOrderCancelReturns,
} from '../../../../../lib/modules/authed/IAlunaOrderModule'
import { GateHttp } from '../../../GateHttp'
import { gateEndpoints } from '../../../gateSpecs'
import { IGateOrderSchema } from '../../../schemas/IGateOrderSchema'



const log = debug('@alunajs:gate/order/cancel')



export const cancel = (exchange: IAlunaExchangeAuthed) => async (
  params: IAlunaOrderCancelParams,
): Promise<IAlunaOrderCancelReturns> => {

  log('canceling order', params)

  const { credentials } = exchange

  const {
    id,
    http = new GateHttp(),
  } = params

  try {

    // TODO: Implement proper request
    const rawOrder = await http.authedRequest<IGateOrderSchema>({
      verb: AlunaHttpVerbEnum.DELETE,
      url: gateEndpoints.order.get(id, ''),
      credentials,
    })

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