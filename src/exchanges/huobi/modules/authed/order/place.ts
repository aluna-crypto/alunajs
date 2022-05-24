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

  const body = {
    symbol: symbolPair,
    type: `${translatedOrderSide}-${translatedOrderType}`,
    'account-id': accountId,
    amount: amount.toString(),
    source: 'spot-api',
  }

  if (translatedOrderType === HuobiOrderTypeEnum.LIMIT) {

    Object.assign(body, {
      price: rate!.toString(),
    })

  }

  log('placing new order for Huobi')

  let placedOrderId: string

  try {

    placedOrderId = await http.authedRequest<string>({
      url: getHuobiEndpoints(settings).order.place,
      body,
      credentials,
    })

  } catch (err) {

    let {
      code,
      message,
    } = err

    const { metadata } = err

    if (metadata.code === 'order-accountbalance-error') {

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
