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
import { translateOrderSideToSample } from '../../../enums/adapters/sampleOrderSideAdapter'
import { translateOrderTypeToSample } from '../../../enums/adapters/sampleOrderTypeAdapter'
import { SampleHttp } from '../../../SampleHttp'
import { getSampleEndpoints } from '../../../sampleSpecs'
import { ISampleOrderSchema } from '../../../schemas/ISampleOrderSchema'



const log = debug('alunajs:sample/order/place')



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
    orderParams: params,
  })

  const {
    amount,
    rate,
    symbolPair,
    side,
    type,
    http = new SampleHttp(settings),
  } = params

  const translatedOrderType = translateOrderTypeToSample({
    from: type,
  })

  // TODO: Validate all body properties
  const body = {
    direction: translateOrderSideToSample({ from: side }),
    marketSymbol: symbolPair,
    type: translatedOrderType,
    quantity: Number(amount),
    rate,
  }

  log('placing new order for Sample')

  let placedOrder: ISampleOrderSchema

  try {

    // TODO: Implement proper request
    const orderResponse = await http.authedRequest<ISampleOrderSchema>({
      url: getSampleEndpoints(settings).order.place,
      body,
      credentials,
    })

    placedOrder = orderResponse

  } catch (err) {

    let {
      code,
      message,
      httpStatusCode,
    } = err

    const {
      metadata,
    } = err

    if (metadata.code === 'INSUFFICIENT_FUNDS') {

      code = AlunaBalanceErrorCodes.INSUFFICIENT_BALANCE
      message = 'Account has insufficient balance for requested action.'
      httpStatusCode = 200

    } else if (metadata.code === 'MIN_TRADE_REQUIREMENT_NOT_MET') {

      code = AlunaOrderErrorCodes.PLACE_FAILED
      message = 'The trade was smaller than the min trade size quantity for '
        .concat('the market')
      httpStatusCode = 200

    }

    throw new AlunaError({
      ...err,
      code,
      message,
      httpStatusCode,
    })

  }

  const { order } = exchange.order.parse({ rawOrder: placedOrder })

  const { requestWeight } = http

  return {
    order,
    requestWeight,
  }

}
