import { debug } from 'debug'

import { AlunaError } from '../../../../../lib/core/AlunaError'
import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import { AlunaBalanceErrorCodes } from '../../../../../lib/errors/AlunaBalanceErrorCodes'
import {
  IAlunaOrderPlaceParams,
  IAlunaOrderPlaceReturns,
} from '../../../../../lib/modules/authed/IAlunaOrderModule'
import { ensureOrderIsSupported } from '../../../../../utils/orders/ensureOrderIsSupported'
import { placeOrderParamsSchema } from '../../../../../utils/validation/schemas/placeOrderParamsSchema'
import { validateParams } from '../../../../../utils/validation/validateParams'
import { translateOrderSideToGate } from '../../../enums/adapters/gateOrderSideAdapter'
import { GateHttp } from '../../../GateHttp'
import { getGateEndpoints } from '../../../gateSpecs'
import { IGateOrderSchema } from '../../../schemas/IGateOrderSchema'



const log = debug('alunajs:gate/order/place')



export const place = (exchange: IAlunaExchangeAuthed) => async (
  params: IAlunaOrderPlaceParams,
): Promise<IAlunaOrderPlaceReturns> => {

  log('placing order', params)

  const {
    settings,
    credentials,
  } = exchange

  validateParams({
    params,
    schema: placeOrderParamsSchema,
  })

  ensureOrderIsSupported({
    exchangeSpecs: exchange.specs,
    orderParams: params,
  })

  const {
    amount,
    rate,
    symbolPair,
    side,
    http = new GateHttp(settings),
  } = params

  const body = {
    side: translateOrderSideToGate({ from: side }),
    currency_pair: symbolPair,
    amount: amount.toString(),
    price: rate!.toString(),
  }

  log('placing new order for Gate')

  const { orderAnnotation } = exchange.settings

  if (orderAnnotation) {

    Object.assign(body, { text: orderAnnotation })

  }

  let placedOrder: IGateOrderSchema

  try {

    const orderResponse = await http.authedRequest<IGateOrderSchema>({
      url: getGateEndpoints(settings).order.place,
      body,
      credentials,
    })

    placedOrder = orderResponse

  } catch (err) {

    const { message } = err

    let { code } = err

    const { metadata } = err

    const INSUFFICIENT_BALANCE_LABEL = 'BALANCE_NOT_ENOUGH'

    const isInsufficientBalanceError = metadata.label
      === INSUFFICIENT_BALANCE_LABEL

    if (isInsufficientBalanceError) {

      code = AlunaBalanceErrorCodes.INSUFFICIENT_BALANCE

    }

    throw new AlunaError({
      ...err,
      code,
      message,
    })

  }

  const { order } = exchange.order.parse({ rawOrder: placedOrder })

  const { requestWeight } = http

  return {
    order,
    requestWeight,
  }

}
