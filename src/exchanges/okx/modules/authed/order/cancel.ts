import { debug } from 'debug'

import { AlunaError } from '../../../../../lib/core/AlunaError'
import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import { AlunaOrderTypesEnum } from '../../../../../lib/enums/AlunaOrderTypesEnum'
import { AlunaOrderErrorCodes } from '../../../../../lib/errors/AlunaOrderErrorCodes'
import {
  IAlunaOrderCancelParams,
  IAlunaOrderCancelReturns,
} from '../../../../../lib/modules/authed/IAlunaOrderModule'
import { OkxHttp } from '../../../OkxHttp'
import { getOkxEndpoints } from '../../../okxSpecs'



const log = debug('alunajs:okx/order/cancel')



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
    symbolPair,
    http = new OkxHttp(settings),
  } = params

  const { order } = await exchange.order.get({
    id,
    symbolPair,
  })

  const { type } = order

  const isStopLimitOrder = type === AlunaOrderTypesEnum.STOP_LIMIT

  const body = {
    instId: symbolPair,
  }

  if (isStopLimitOrder) {

    Object.assign(body, {
      algoId: id,
    })

  } else {

    Object.assign(body, {
      ordId: id,
    })

  }

  try {
    const orderEndpoints = getOkxEndpoints(settings).order

    const url = isStopLimitOrder
      ? orderEndpoints.cancelStopLimit
      : orderEndpoints.cancel


    await http.authedRequest<void>({
      url,
      credentials,
      body,
    })


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
