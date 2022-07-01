import BigNumber from 'bignumber.js'
import { debug } from 'debug'
import { assign } from 'lodash'

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
import { HuobiHttp } from '../../../HuobiHttp'
import { getHuobiEndpoints } from '../../../huobiSpecs'
import { IHuobiOrderResponseSchema } from '../../../schemas/IHuobiOrderSchema'
import { getHuobiAccountId } from '../helpers/getHuobiAccountId'



const log = debug('alunajs:huobi/order/place')



type THuobiPlaceResponse = { clientOrderId: string } | string



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

  const isConditionalOrder = type === AlunaOrderTypesEnum.STOP_LIMIT
    || type === AlunaOrderTypesEnum.STOP_MARKET

  if (isConditionalOrder && !clientOrderId) {

    throw new AlunaError({
      httpStatusCode: 200,
      message: "param 'clientOrderId' is required for conditional orders",
      code: AlunaGenericErrorCodes.PARAM_ERROR,
      metadata: params,
    })

  }

  const translatedOrderSide = translateOrderSideToHuobi({ from: side })

  const translatedOrderType = translateOrderTypeToHuobi({
    type,
    side,
  })

  const {
    accountId,
  } = await getHuobiAccountId({
    credentials,
    http,
    settings,
  })

  let url: string
  let orderAmount = amount
  const body = {
    symbol: symbolPair,
  }


  /**
  * When placing a buy 'market' or 'stop-market' orders on Huobi, the 'amount'
  * property should be the order total value (amount in quote currency).
  * Therefore we need to have the current asset price to make the math
  * operation.
  */
  const isMarketOrder = /market/.test(translatedOrderType)
  let marketPrice = ''

  if (isMarketOrder && (translatedOrderSide === 'buy')) {

    const { market } = await exchange.market.get!({
      http,
      symbolPair,
    })

    marketPrice = market.ticker.last.toString()

    orderAmount = new BigNumber(amount)
      .times(market.ticker.last)
      .toNumber()

  }

  if (isConditionalOrder) {

    url = getHuobiEndpoints(settings).order.placeConditional

    assign(body, {
      accountId,
      clientOrderId,
      orderType: translatedOrderType,
      orderSide: translatedOrderSide,
      stopPrice: stopRate!.toString(),
    })

  } else {

    url = getHuobiEndpoints(settings).order.place

    assign(body, {
      'account-id': accountId,
      ...(clientOrderId ? { 'client-order-id': clientOrderId } : {}),
      type: translatedOrderType,
      amount: orderAmount.toString(),
    })

  }

  switch (type) {

    case AlunaOrderTypesEnum.LIMIT:
      assign(body, { price: rate!.toString() })
      break

    case AlunaOrderTypesEnum.STOP_LIMIT:

      assign(body, {
        orderPrice: limitRate!.toString(),
        orderSize: orderAmount.toString(),
      })
      break

    case AlunaOrderTypesEnum.STOP_MARKET:

      assign(body, { orderValue: orderAmount.toString() })
      break

    default:

  }

  log('placing new order for Huobi')

  try {

    const placeResponse = await http.authedRequest<THuobiPlaceResponse>({
      url,
      body,
      credentials,
    })

    const orderId = (placeResponse as { clientOrderId: string }).clientOrderId
      || placeResponse as string

    const { rawOrder } = await exchange.order.getRaw({
      id: orderId,
      symbolPair,
      type,
      http,
      clientOrderId,
    })

    const {
      huobiOrder,
      rawSymbol,
    } = rawOrder as IHuobiOrderResponseSchema

    const { order } = exchange.order.parse({
      rawOrder: {
        rawSymbol,
        huobiOrder: {
          ...huobiOrder,
          ...(isMarketOrder ? { price: marketPrice } : {}),
        },
      },
    })

    const { requestWeight } = http

    return {
      order,
      requestWeight,
    }

  } catch (err) {

    let {
      code,
      message,
      httpStatusCode,
    } = err


    if (/trade account balance is not enough/.test(message)) {

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

}
