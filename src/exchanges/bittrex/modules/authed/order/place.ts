import { debug } from 'debug'
import { assign } from 'lodash'

import { AlunaError } from '../../../../../lib/core/AlunaError'
import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import { AlunaBalanceErrorCodes } from '../../../../../lib/errors/AlunaBalanceErrorCodes'
import { AlunaGenericErrorCodes } from '../../../../../lib/errors/AlunaGenericErrorCodes'
import { AlunaOrderErrorCodes } from '../../../../../lib/errors/AlunaOrderErrorCodes'
import {
  IAlunaOrderPlaceParams,
  IAlunaOrderPlaceReturns,
} from '../../../../../lib/modules/authed/IAlunaOrderModule'
import { ensureOrderIsSupported } from '../../../../../utils/orders/ensureOrderIsSupported'
import { placeOrderParamsSchema } from '../../../../../utils/validation/schemas/placeOrderParamsSchema'
import { validateParams } from '../../../../../utils/validation/validateParams'
import { BittrexHttp } from '../../../BittrexHttp'
import { BITTREX_PRODUCTION_URL } from '../../../bittrexSpecs'
import { translateOrderSideToBittrex } from '../../../enums/adapters/bittrexOrderSideAdapter'
import { translateOrderTypeToBittrex } from '../../../enums/adapters/bittrexOrderTypeAdapter'
import { BittrexOrderTimeInForceEnum } from '../../../enums/BittrexOrderTimeInForceEnum'
import { BittrexOrderTypeEnum } from '../../../enums/BittrexOrderTypeEnum'
import { IBittrexOrderSchema } from '../../../schemas/IBittrexOrderSchema'



const log = debug('@aluna.js:bittrex/order/place')



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
    http = new BittrexHttp(),
  } = params

  const translatedOrderType = translateOrderTypeToBittrex({
    from: type,
  })

  const body = {
    direction: translateOrderSideToBittrex({ from: side }),
    marketSymbol: symbolPair,
    type: translatedOrderType,
    quantity: Number(amount),
  }

  if (translatedOrderType === BittrexOrderTypeEnum.LIMIT) {

    assign(body, {
      limit: Number(rate),
      timeInForce: BittrexOrderTimeInForceEnum.GOOD_TIL_CANCELLED,
    })

  } else {

    assign(body, {
      timeInForce: BittrexOrderTimeInForceEnum.FILL_OR_KILL,
    })

  }

  log('placing new order for Bittrex')

  let placedOrder: IBittrexOrderSchema

  try {

    const orderResponse = await http.authedRequest<IBittrexOrderSchema>({
      url: `${BITTREX_PRODUCTION_URL}/orders`,
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

    if (metadata.code === 'INSUFFICIENT_FUNDS') {

      code = AlunaBalanceErrorCodes.INSUFFICIENT_BALANCE

      message = 'Account has insufficient balance for requested action.'

    } else if (metadata.code === 'DUST_TRADE_DISALLOWED_MIN_VALUE') {

      code = AlunaGenericErrorCodes.UNKNOWN

      message = 'The amount of quote currency involved in a transaction '
        .concat('would be less than the minimum limit of 10K satoshis')

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
