import { debug } from 'debug'

import { AlunaError } from '../../../../../lib/core/AlunaError'
import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import { AlunaOrderTypesEnum } from '../../../../../lib/enums/AlunaOrderTypesEnum'
import { AlunaBalanceErrorCodes } from '../../../../../lib/errors/AlunaBalanceErrorCodes'
import {
  IAlunaOrderPlaceParams,
  IAlunaOrderPlaceReturns,
} from '../../../../../lib/modules/authed/IAlunaOrderModule'
import { ensureOrderIsSupported } from '../../../../../utils/orders/ensureOrderIsSupported'
import { placeOrderParamsSchema } from '../../../../../utils/validation/schemas/placeOrderParamsSchema'
import { validateParams } from '../../../../../utils/validation/validateParams'
import { translateOrderSideToFtx } from '../../../enums/adapters/ftxOrderSideAdapter'
import { translateOrderTypeToFtx } from '../../../enums/adapters/ftxOrderTypeAdapter'
import { FtxHttp } from '../../../FtxHttp'
import { getFtxEndpoints } from '../../../ftxSpecs'
import { IFtxOrderSchema } from '../../../schemas/IFtxOrderSchema'



const log = debug('alunajs:ftx/order/place')



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
    limitRate,
    stopRate,
    reduceOnly,
    http = new FtxHttp(settings),
  } = params

  const translatedOrderSide = translateOrderSideToFtx({
    from: side,
  })

  const translatedOrderType = translateOrderTypeToFtx({
    from: type,
  })

  let url: string

  const body: Record<string, any> = {
    side: translatedOrderSide,
    market: symbolPair,
    size: amount,
    type: translatedOrderType,
    ...(reduceOnly ? { reduceOnly } : {}),
  }

  switch (type) {

    case AlunaOrderTypesEnum.LIMIT:
      url = getFtxEndpoints(settings).order.place
      body.price = rate
      break

    case AlunaOrderTypesEnum.STOP_MARKET:
      url = getFtxEndpoints(settings).order.placeTriggerOrder
      body.triggerPrice = stopRate
      break

    case AlunaOrderTypesEnum.STOP_LIMIT:
      url = getFtxEndpoints(settings).order.placeTriggerOrder
      body.triggerPrice = stopRate
      body.orderPrice = limitRate
      break

    // Market orders
    default:
      url = getFtxEndpoints(settings).order.place
      body.price = null

  }

  log('placing new order for Ftx')

  try {

    const orderResponse = await http.authedRequest<IFtxOrderSchema>({
      url,
      body,
      credentials,
    })

    const { order } = await exchange.order.get({
      id: orderResponse.id.toString(),
      symbolPair: params.symbolPair,
      http,
      type: AlunaOrderTypesEnum.LIMIT,
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

    const NOT_ENOUGH_BALANCE_MESSAGE = 'Not enough balances'

    if (message === NOT_ENOUGH_BALANCE_MESSAGE) {

      code = AlunaBalanceErrorCodes.INSUFFICIENT_BALANCE
      message = 'Account has insufficient balance for requested action.'
      httpStatusCode = 200

    }

    throw new AlunaError({
      ...err,
      code,
      message,
      httpStatusCode,
    })

  }

}
