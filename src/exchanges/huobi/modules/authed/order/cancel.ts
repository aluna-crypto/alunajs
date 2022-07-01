import { debug } from 'debug'

import { AlunaError } from '../../../../../lib/core/AlunaError'
import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import { AlunaOrderTypesEnum } from '../../../../../lib/enums/AlunaOrderTypesEnum'
import { AlunaGenericErrorCodes } from '../../../../../lib/errors/AlunaGenericErrorCodes'
import { AlunaOrderErrorCodes } from '../../../../../lib/errors/AlunaOrderErrorCodes'
import {
  IAlunaOrderCancelParams,
  IAlunaOrderCancelReturns,
} from '../../../../../lib/modules/authed/IAlunaOrderModule'
import { HuobiHttp } from '../../../HuobiHttp'
import { getHuobiEndpoints } from '../../../huobiSpecs'



const log = debug('alunajs:huobi/order/cancel')



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
    type,
    clientOrderId,
    http = new HuobiHttp(settings),
  } = params

  let url = getHuobiEndpoints(settings).order.cancel(id)
  let body

  if (type === AlunaOrderTypesEnum.STOP_LIMIT || type === AlunaOrderTypesEnum.STOP_MARKET) {

    if (!clientOrderId) {

      throw new AlunaError({
        httpStatusCode: 200,
        message: "param 'clientOrderId' is required for conditional orders",
        code: AlunaGenericErrorCodes.PARAM_ERROR,
        metadata: params,
      })

    }

    url = getHuobiEndpoints(settings).order.cancelStop

    body = {
      clientOrderIds: [clientOrderId],
    }

  }

  try {

    await http.authedRequest<string>({
      url,
      credentials,
      body,
    })

    const { order } = await exchange.order.get({
      id,
      symbolPair,
      type,
      clientOrderId,
      http,
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
