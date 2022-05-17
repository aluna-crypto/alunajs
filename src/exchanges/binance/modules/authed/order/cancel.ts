import { debug } from 'debug'

import { AlunaError } from '../../../../../lib/core/AlunaError'
import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import { AlunaAccountEnum } from '../../../../../lib/enums/AlunaAccountEnum'
import { AlunaHttpVerbEnum } from '../../../../../lib/enums/AlunaHtttpVerbEnum'
import { AlunaGenericErrorCodes } from '../../../../../lib/errors/AlunaGenericErrorCodes'
import { AlunaOrderErrorCodes } from '../../../../../lib/errors/AlunaOrderErrorCodes'
import {
  IAlunaOrderCancelParams,
  IAlunaOrderCancelReturns,
} from '../../../../../lib/modules/authed/IAlunaOrderModule'
import { BinanceHttp } from '../../../BinanceHttp'
import { getBinanceEndpoints } from '../../../binanceSpecs'
import { IBinanceOrderSchema } from '../../../schemas/IBinanceOrderSchema'



const log = debug('@alunajs:binance/order/cancel')



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
    account,
    symbolPair,
    http = new BinanceHttp(settings),
  } = params

  if (!account) {

    const error = new AlunaError({
      code: AlunaGenericErrorCodes.PARAM_ERROR,
      message: 'Order account is required to cancel Binance orders',
      httpStatusCode: 400,
    })

    log(error)

    throw error

  }

  try {

    const orderEndpoints = getBinanceEndpoints(settings).order

    let url: string
    let weight: number

    if (account === AlunaAccountEnum.SPOT) {

      url = orderEndpoints.spot
      weight = 1

    } else {

      url = orderEndpoints.margin
      weight = 10

    }

    const query = new URLSearchParams()

    query.append('orderId', id)
    query.append('symbol', symbolPair)

    const rawOrder = await http.authedRequest<IBinanceOrderSchema>({
      verb: AlunaHttpVerbEnum.DELETE,
      url,
      credentials,
      query,
      weight,
    })

    const { order } = await exchange.order.get({
      id: rawOrder.orderId.toString(),
      symbolPair,
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
