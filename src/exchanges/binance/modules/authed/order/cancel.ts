import { debug } from 'debug'

import { AlunaError } from '../../../../../lib/core/AlunaError'
import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import { AlunaHttpVerbEnum } from '../../../../../lib/enums/AlunaHtttpVerbEnum'
import { AlunaOrderErrorCodes } from '../../../../../lib/errors/AlunaOrderErrorCodes'
import {
  IAlunaOrderCancelParams,
  IAlunaOrderCancelReturns,
} from '../../../../../lib/modules/authed/IAlunaOrderModule'
import { BinanceHttp } from '../../../BinanceHttp'
import { getBinanceEndpoints } from '../../../binanceSpecs'
import { IBinanceOrderSchema } from '../../../schemas/IBinanceOrderSchema'



const log = debug('alunajs:binance/order/cancel')



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
    http = new BinanceHttp(settings),
  } = params

  try {

    const body = {
      orderId: id,
      symbol: symbolPair,
    }

    const rawOrder = await http.authedRequest<IBinanceOrderSchema>({
      verb: AlunaHttpVerbEnum.DELETE,
      url: getBinanceEndpoints(settings).order.get,
      credentials,
      body,
      weight: 2,
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
