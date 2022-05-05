import { debug } from 'debug'

import { AlunaError } from '../../../../../lib/core/AlunaError'
import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import { AlunaBalanceErrorCodes } from '../../../../../lib/errors/AlunaBalanceErrorCodes'
import { AlunaOrderErrorCodes } from '../../../../../lib/errors/AlunaOrderErrorCodes'
import {
  IAlunaOrderPlaceParams,
  IAlunaOrderPlaceReturns,
} from '../../../../../lib/modules/authed/IAlunaOrderModule'
import { ensureOrderIsSupported } from '../../../../../utils/orders/ensureOrderIsSupported'
import { placeOrderParamsSchema } from '../../../../../utils/validation/schemas/placeOrderParamsSchema'
import { validateParams } from '../../../../../utils/validation/validateParams'
import { BitfinexHttp } from '../../../BitfinexHttp'
import { bitfinexEndpoints } from '../../../bitfinexSpecs'
import { translateOrderSideToBitfinex } from '../../../enums/adapters/bitfinexOrderSideAdapter'
import { translateOrderTypeToBitfinex } from '../../../enums/adapters/bitfinexOrderTypeAdapter'
import { IBitfinexOrderSchema } from '../../../schemas/IBitfinexOrderSchema'



const log = debug('@alunajs:bitfinex/order/place')



export const place = (exchange: IAlunaExchangeAuthed) => async (
  params: IAlunaOrderPlaceParams,
): Promise<IAlunaOrderPlaceReturns> => {

  log('params', params)

  const { credentials } = exchange

  validateParams({
    params,
    schema: placeOrderParamsSchema,
  })

  ensureOrderIsSupported({
    exchangeSpecs: exchange.specs,
    orderPlaceParams: params,
  })

  const {
    amount,
    rate,
    symbolPair,
    side,
    type,
    account,
    http = new BitfinexHttp(),
  } = params

  const translatedOrderType = translateOrderTypeToBitfinex({
    from: type,
    account,
  })

  // TODO: Validate all body properties
  const body = {
    direction: translateOrderSideToBitfinex({ from: side }),
    marketSymbol: symbolPair,
    type: translatedOrderType,
    quantity: Number(amount),
    rate,
  }

  log('placing new order for Bitfinex')

  let placedOrder: IBitfinexOrderSchema

  try {

    // TODO: Implement proper request
    const orderResponse = await http.authedRequest<IBitfinexOrderSchema>({
      url: bitfinexEndpoints.order.place,
      body,
      credentials,
    })

    placedOrder = orderResponse

  } catch (err) {

    let {
      code,
      message,
    } = err

    const { metadata } = err

    // TODO: Review error handlings
    if (metadata.code === 'INSUFFICIENT_FUNDS') {

      code = AlunaBalanceErrorCodes.INSUFFICIENT_BALANCE

      message = 'Account has insufficient balance for requested action.'

    } else if (metadata.code === 'MIN_TRADE_REQUIREMENT_NOT_MET') {

      code = AlunaOrderErrorCodes.PLACE_FAILED

      message = 'The trade was smaller than the min trade size quantity for '
        .concat('the market')

    }

    throw new AlunaError({
      ...err,
      code,
      message,
    })

  }

  const { order } = exchange.order.parse({ rawOrder: placedOrder })

  const { requestCount } = http

  return {
    order,
    requestCount,
  }

}
