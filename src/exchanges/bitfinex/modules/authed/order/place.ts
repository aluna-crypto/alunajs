import { debug } from 'debug'

import { AlunaError } from '../../../../../lib/core/AlunaError'
import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import { AlunaOrderTypesEnum } from '../../../../../lib/enums/AlunaOrderTypesEnum'
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
import {
  bitfinexBaseSpecs,
  bitfinexEndpoints,
} from '../../../bitfinexSpecs'
import { translateOrderSideToBitfinex } from '../../../enums/adapters/bitfinexOrderSideAdapter'
import { translateOrderTypeToBitfinex } from '../../../enums/adapters/bitfinexOrderTypeAdapter'
import {
  IBitfinexOrderSchema,
  TBitfinexPlaceOrderResponse,
} from '../../../schemas/IBitfinexOrderSchema'



const log = debug('@alunajs:bitfinex/order/place')



export const place = (exchange: IAlunaExchangeAuthed) => async (
  params: IAlunaOrderPlaceParams,
): Promise<IAlunaOrderPlaceReturns> => {

  log('placing order', params)

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
    limitRate,
    stopRate,
    http = new BitfinexHttp(exchange.settings),
  } = params

  const translatedOrderType = translateOrderTypeToBitfinex({
    from: type,
    account,
  })

  const translatedAmount = translateOrderSideToBitfinex({
    amount: Number(amount),
    side,
  })

  let price: undefined | string
  let priceAuxLimit: undefined | string

  switch (type) {

    case AlunaOrderTypesEnum.LIMIT:
      price = rate!.toString()
      break

    case AlunaOrderTypesEnum.STOP_MARKET:
      price = stopRate!.toString()
      break

    case AlunaOrderTypesEnum.STOP_LIMIT:
      price = stopRate!.toString()
      priceAuxLimit = limitRate!.toString()
      break

    default:

  }

  const { affiliateCode } = bitfinexBaseSpecs.settings

  const body = {
    amount: translatedAmount,
    symbol: symbolPair,
    type: translatedOrderType,
    ...(price ? { price } : {}),
    ...(priceAuxLimit ? { price_aux_limit: priceAuxLimit } : {}),
    ...(affiliateCode ? { meta: { aff_code: affiliateCode } } : {}),

  }

  log('placing new order for Bitfinex')

  let rawOrder: IBitfinexOrderSchema

  try {

    const response = await http.authedRequest<TBitfinexPlaceOrderResponse>({
      url: bitfinexEndpoints.order.place,
      body,
      credentials,
    })

    const [
      _mts,
      _type,
      _messageId,
      _placeHolder,
      [placedOrder],
      _code,
      status,
      text,
    ] = response

    if (status !== 'SUCCESS') {

      throw new AlunaError({
        code: AlunaOrderErrorCodes.PLACE_FAILED,
        message: text,
        metadata: response,
      })

    }

    rawOrder = placedOrder

    const { order } = exchange.order.parse({ rawOrder })

    const { requestCount } = http

    return {
      order,
      requestCount,
    }

  } catch (err) {

    const { message, metadata } = err

    let {
      code,
      httpStatusCode,
    } = err

    if (/not enough.+balance/i.test(err.message)) {

      code = AlunaBalanceErrorCodes.INSUFFICIENT_BALANCE
      httpStatusCode = 400

    }

    const error = new AlunaError({
      message,
      code,
      httpStatusCode,
      metadata,
    })

    log(error)

    throw error

  }

}
