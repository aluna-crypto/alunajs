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
import { getBitfinexEndpoints } from '../../../bitfinexSpecs'
import { translateOrderSideToBitfinex } from '../../../enums/adapters/bitfinexOrderSideAdapter'
import { translateOrderTypeToBitfinex } from '../../../enums/adapters/bitfinexOrderTypeAdapter'
import { BitfinexOrderStatusEnum } from '../../../enums/BitfinexOrderStatusEnum'
import { TBitfinexPlaceOrderResponse } from '../../../schemas/IBitfinexOrderSchema'



const log = debug('alunajs:bitfinex/order/place')



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
    account,
    limitRate,
    stopRate,
    http = new BitfinexHttp(settings),
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

  const { affiliateCode } = exchange.specs.settings

  const body = {
    amount: translatedAmount,
    symbol: symbolPair,
    type: translatedOrderType,
    ...(price ? { price } : {}),
    ...(priceAuxLimit ? { price_aux_limit: priceAuxLimit } : {}),
    ...(affiliateCode ? { meta: { aff_code: affiliateCode } } : {}),
  }

  log('placing new order for Bitfinex')

  try {

    const response = await http.authedRequest<TBitfinexPlaceOrderResponse>({
      url: getBitfinexEndpoints(settings).order.place,
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
        httpStatusCode: 500,
        metadata: response,
      })

    }

    /**
     * Because Bitfinex does not return market orders with the updated status,
     * and executing a request to get a market order (instantly filled)
     * immediatily after placing it results (almost always) on the API returning
     * an error because it didn't found the order, we then need to update the
     * order status manually.
     */
    if (/MARKET/.test(placedOrder[8])) {
      placedOrder[13] = BitfinexOrderStatusEnum.EXECUTED
    }

    const { order } = exchange.order.parse({
      rawOrder: placedOrder,
    })

    const { requestWeight } = http


    return {
      order,
      requestWeight,
    }

  } catch (err) {

    const { message, metadata } = err

    let {
      code,
      httpStatusCode,
    } = err

    if (/not enough.+balance/i.test(err.message)) {

      code = AlunaBalanceErrorCodes.INSUFFICIENT_BALANCE
      httpStatusCode = 200

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
