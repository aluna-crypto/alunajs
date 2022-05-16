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
import { translateOrderSideToPoloniex } from '../../../enums/adapters/poloniexOrderSideAdapter'
import { PoloniexOrderTimeInForceEnum } from '../../../enums/PoloniexOrderTimeInForceEnum'
import { PoloniexHttp } from '../../../PoloniexHttp'
import { getPoloniexEndpoints } from '../../../poloniexSpecs'
import { IPoloniexOrderPlaceResponseSchema } from '../../../schemas/IPoloniexOrderSchema'



const log = debug('@alunajs:poloniex/order/place')



export const place = (exchange: IAlunaExchangeAuthed) => async (
  params: IAlunaOrderPlaceParams,
): Promise<IAlunaOrderPlaceReturns> => {

  log('placing order', params)

  const {
    specs,
    settings,
    credentials,
  } = exchange

  validateParams({
    params,
    schema: placeOrderParamsSchema,
  })

  ensureOrderIsSupported({
    exchangeSpecs: specs,
    orderPlaceParams: params,
  })

  const {
    amount,
    rate,
    symbolPair,
    side,
    http = new PoloniexHttp(settings),
  } = params

  log('placing new order for Poloniex')

  let placedOrder: IPoloniexOrderPlaceResponseSchema

  try {

    const translatedOrderType = translateOrderSideToPoloniex({
      from: side,
    })

    const timestamp = new Date().getTime()
    const body = new URLSearchParams()

    body.append('command', translatedOrderType)
    body.append('currencyPair', symbolPair)
    body.append('amount', amount.toString())
    body.append('rate', rate!.toString())
    body.append(PoloniexOrderTimeInForceEnum.POST_ONLY, '1')
    body.append('nonce', timestamp.toString())

    const orderResponse = await http.authedRequest<IPoloniexOrderPlaceResponseSchema>({
      url: getPoloniexEndpoints(settings).order.place,
      body,
      credentials,
    })

    placedOrder = orderResponse

  } catch (err) {

    let {
      code,
      message,
    } = err

    const isInsufficientBalanceError = err.message.includes('Not enough')

    if (isInsufficientBalanceError) {

      code = AlunaBalanceErrorCodes.INSUFFICIENT_BALANCE

      message = 'Account has insufficient balance for requested action.'

    }

    throw new AlunaError({
      ...err,
      code,
      message,
    })

  }

  const { orderNumber, currencyPair } = placedOrder

  const { order } = await exchange.order.get({
    id: orderNumber,
    symbolPair: currencyPair,
  })

  const { requestWeight } = http

  return {
    order,
    requestWeight,
  }

}
