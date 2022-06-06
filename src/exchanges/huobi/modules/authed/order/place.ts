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
import { translateOrderSideToHuobi } from '../../../enums/adapters/huobiOrderSideAdapter'
import { translateOrderTypeToHuobi } from '../../../enums/adapters/huobiOrderTypeAdapter'
import { HuobiConditionalOrderTypeEnum } from '../../../enums/HuobiConditionalOrderTypeEnum'
import { HuobiOrderTypeEnum } from '../../../enums/HuobiOrderTypeEnum'
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
    orderPlaceParams: params,
  })

  const {
    amount,
    rate,
    symbolPair,
    side,
    type,
    stopRate,
    limitRate,
    http = new HuobiHttp(settings),
  } = params

  const translatedOrderType = translateOrderTypeToHuobi({
    from: type,
  })

  const translatedOrderSide = translateOrderSideToHuobi({ from: side })

  const {
    accountId,
  } = await getHuobiAccountId({
    credentials,
    http,
    settings,
  })

  let url = getHuobiEndpoints(settings).order.place

  const body = {
    symbol: symbolPair,
  }

  switch (translatedOrderType) {

    case HuobiOrderTypeEnum.LIMIT:
      Object.assign(body, {
        type: `${translatedOrderSide}-${translatedOrderType}`,
        'account-id': accountId,
        amount: amount.toString(),
        source: 'spot-api',
        price: rate!.toString(),
      })
      break

    case HuobiOrderTypeEnum.STOP_LIMIT:
      Object.assign(body, {
        accountId,
        orderPrice: limitRate!.toString(),
        orderSide: translatedOrderSide,
        orderSize: amount.toString(),
        orderType: HuobiConditionalOrderTypeEnum.LIMIT,
        stopPrice: stopRate!.toString(),
      })
      url = getHuobiEndpoints(settings).order.placeStop
      break

    case HuobiOrderTypeEnum.STOP_MARKET:
      Object.assign(body, {
        accountId,
        orderSide: translatedOrderSide,
        orderValue: amount.toString(),
        orderType: HuobiConditionalOrderTypeEnum.MARKET,
        stopPrice: stopRate!.toString(),
      })
      url = getHuobiEndpoints(settings).order.placeStop
      break

    default:

      Object.assign(body, {
        type: `${translatedOrderSide}-${translatedOrderType}`,
        'account-id': accountId,
        amount: amount.toString(),
        source: 'spot-api',
      })
      break


  }

  log('placing new order for Huobi')

  let placedOrderId: string

  try {

    placedOrderId = await http.authedRequest<string>({
      url,
      body,
      credentials,
    })

  } catch (err) {

    let {
      code,
      message,
    } = err

    const { metadata } = err

    if (metadata['err-code'] === 'account-frozen-balance-insufficient-error') {

      code = AlunaBalanceErrorCodes.INSUFFICIENT_BALANCE

      message = 'Account has insufficient balance for requested action.'

    }

    throw new AlunaError({
      ...err,
      code,
      message,
    })

  }

  const { order } = await exchange.order.get({
    id: placedOrderId,
    symbolPair,
  })

  const { requestWeight } = http

  return {
    order,
    requestWeight,
  }

}
