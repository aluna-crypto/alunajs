import { debug } from 'debug'

import { AlunaError } from '../../../../../lib/core/AlunaError'
import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import { AlunaOrderStatusEnum } from '../../../../../lib/enums/AlunaOrderStatusEnum'
import { AlunaOrderErrorCodes } from '../../../../../lib/errors/AlunaOrderErrorCodes'
import {
  IAlunaOrderCancelParams,
  IAlunaOrderCancelReturns,
} from '../../../../../lib/modules/authed/IAlunaOrderModule'
import { PoloniexHttp } from '../../../PoloniexHttp'
import { getPoloniexEndpoints } from '../../../poloniexSpecs'
import { IPoloniexOrderSchema } from '../../../schemas/IPoloniexOrderSchema'



const log = debug('@alunajs:poloniex/order/cancel')



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
    http = new PoloniexHttp(settings),
  } = params

  const {
    order,
  } = await exchange.order.get({
    id,
    symbolPair,
    http,
  })

  try {

    const timestamp = new Date().getTime()
    const body = new URLSearchParams()

    body.append('command', 'cancelOrder')
    body.append('orderNumber', id)
    body.append('nonce', timestamp.toString())

    await http.authedRequest<IPoloniexOrderSchema>({
      url: getPoloniexEndpoints(settings).order.cancel,
      credentials,
      body,
    })

    const { requestWeight } = http

    // Poloniex doesn't return canceled/closed orders
    order.status = AlunaOrderStatusEnum.CANCELED

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
