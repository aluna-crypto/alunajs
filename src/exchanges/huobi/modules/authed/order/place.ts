import { debug } from 'debug'

import { AlunaError } from '../../../../../lib/core/AlunaError'
import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import { AlunaOrderTypesEnum } from '../../../../../lib/enums/AlunaOrderTypesEnum'
import { AlunaBalanceErrorCodes } from '../../../../../lib/errors/AlunaBalanceErrorCodes'
import { AlunaGenericErrorCodes } from '../../../../../lib/errors/AlunaGenericErrorCodes'
import {
  IAlunaOrderPlaceParams,
  IAlunaOrderPlaceReturns,
} from '../../../../../lib/modules/authed/IAlunaOrderModule'
import { ensureOrderIsSupported } from '../../../../../utils/orders/ensureOrderIsSupported'
import { placeOrderParamsSchema } from '../../../../../utils/validation/schemas/placeOrderParamsSchema'
import { validateParams } from '../../../../../utils/validation/validateParams'
import { translateOrderSideToHuobi } from '../../../enums/adapters/huobiOrderSideAdapter'
import { translateOrderTypeToHuobi } from '../../../enums/adapters/huobiOrderTypeAdapter'
import { HuobiConditionalOrderTypeEnum } from '../../../enums/HuobiConditionalOrderTypeEnum'
import { HuobiHttp } from '../../../HuobiHttp'
import { getHuobiEndpoints } from '../../../huobiSpecs'
import { getHuobiAccountId } from '../helpers/getHuobiAccountId'



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
    orderParams: params,
  })

  const {
    amount,
    rate,
    symbolPair,
    side,
    type,
    stopRate,
    limitRate,
    clientOrderId,
    http = new HuobiHttp(settings),
  } = params

  const translatedOrderSide = translateOrderSideToHuobi({ from: side })

  const translatedOrderType = translateOrderTypeToHuobi({
    from: type,
    side: translatedOrderSide,
  })

  const {
    accountId,
  } = await getHuobiAccountId({
    credentials,
    http,
    settings,
  })

  const paramError = new AlunaError({
    httpStatusCode: 200,
    message: "param 'clientOrderId' is required for conditional orders",
    code: AlunaGenericErrorCodes.PARAM_ERROR,
    metadata: params,
  })

  let url = getHuobiEndpoints(settings).order.place

  const body = {
    symbol: symbolPair,
  }

  switch (type) {

    case AlunaOrderTypesEnum.LIMIT:
      Object.assign(body, {
        type: translatedOrderType,
        'account-id': accountId,
        amount: amount.toString(),
        source: 'spot-api',
        price: rate!.toString(),
        'client-order-id': clientOrderId,
      })
      break

    case AlunaOrderTypesEnum.STOP_LIMIT:

      if (!clientOrderId) {

        throw paramError

      }

      Object.assign(body, {
        accountId,
        orderPrice: limitRate!.toString(),
        orderSide: translatedOrderSide,
        orderSize: amount.toString(),
        orderType: HuobiConditionalOrderTypeEnum.LIMIT,
        stopPrice: stopRate!.toString(),
        clientOrderId,
      })
      url = getHuobiEndpoints(settings).order.placeStop
      break

    case AlunaOrderTypesEnum.STOP_MARKET:

      if (!clientOrderId) {

        throw paramError

      }

      Object.assign(body, {
        accountId,
        orderSide: translatedOrderSide,
        orderValue: amount.toString(),
        orderType: HuobiConditionalOrderTypeEnum.MARKET,
        stopPrice: stopRate!.toString(),
        clientOrderId,
      })
      url = getHuobiEndpoints(settings).order.placeStop
      break

    default:

      Object.assign(body, {
        type: translatedOrderType,
        'account-id': accountId,
        amount: amount.toString(),
        source: 'spot-api',
        'client-order-id': clientOrderId,
      })
      break


  }

  log('placing new order for Huobi')

  let placedOrderId: string

  try {

    type TConditionalOrderPlaceResponse = { clientOrderId: string }

    const placedOrder = await http.authedRequest<TConditionalOrderPlaceResponse | string>({
      url,
      body,
      credentials,
    })

    const isNormalOrder = typeof placedOrder === 'string'

    placedOrderId = isNormalOrder ? placedOrder : placedOrder.clientOrderId

  } catch (err) {

    let {
      code,
      message,
      httpStatusCode,
    } = err

    const { metadata } = err

    if (metadata['err-code'] === 'account-frozen-balance-insufficient-error') {

      httpStatusCode = 200

      code = AlunaBalanceErrorCodes.INSUFFICIENT_BALANCE

      message = 'Account has insufficient balance for requested action.'

    }

    throw new AlunaError({
      ...err,
      code,
      message,
      httpStatusCode,
    })

  }

  const { order } = await exchange.order.get({
    id: placedOrderId,
    symbolPair,
    type,
    http,
    clientOrderId,
  })

  const { requestWeight } = http

  return {
    order,
    requestWeight,
  }

}
