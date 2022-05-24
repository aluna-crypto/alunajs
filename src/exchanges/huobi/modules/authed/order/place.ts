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
import { translateOrderSideToHuobi } from '../../../enums/adapters/huobiOrderSideAdapter'
import { translateOrderTypeToHuobi } from '../../../enums/adapters/huobiOrderTypeAdapter'
import { HuobiHttp } from '../../../HuobiHttp'
import { getHuobiEndpoints } from '../../../huobiSpecs'
import { IHuobiOrderSchema } from '../../../schemas/IHuobiOrderSchema'



const log = debug('alunajs:huobi/order/place')



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
    type,
    http = new HuobiHttp(settings),
  } = params

  const translatedOrderType = translateOrderTypeToHuobi({
    from: type,
  })

  // TODO: Validate all body properties
  const body = {
    direction: translateOrderSideToHuobi({ from: side }),
    marketSymbol: symbolPair,
    type: translatedOrderType,
    quantity: Number(amount),
    rate,
  }

  log('placing new order for Huobi')

  let placedOrder: IHuobiOrderSchema

  try {

    // TODO: Implement proper request
    const orderResponse = await http.authedRequest<IHuobiOrderSchema>({
      url: getHuobiEndpoints(settings).order.place,
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

  const { requestWeight } = http

  return {
    order,
    requestWeight,
  }

}