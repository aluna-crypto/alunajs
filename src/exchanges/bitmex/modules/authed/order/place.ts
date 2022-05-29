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
import { BitmexHttp } from '../../../BitmexHttp'
import { getBitmexEndpoints } from '../../../bitmexSpecs'
import { translateOrderSideToBitmex } from '../../../enums/adapters/bitmexOrderSideAdapter'
import { translateOrderTypeToBitmex } from '../../../enums/adapters/bitmexOrderTypeAdapter'
import { BitmexOrderTypeEnum } from '../../../enums/BitmexOrderTypeEnum'
import {
  IBitmexOrder,
  IBitmexOrderSchema,
} from '../../../schemas/IBitmexOrderSchema'
import { translateAmountToOrderQty } from './helpers/translateAmountToOrderQty'



const log = debug('alunajs:bitmex/order/place')



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
    symbolPair,
    side,
    type,
    rate,
    limitRate,
    stopRate,
    http = new BitmexHttp(settings),
  } = params

  const { market } = await exchange.market.get!({
    symbolPair,
    http,
  })

  const ordType = translateOrderTypeToBitmex({
    from: type,
  })

  const translatedSide = translateOrderSideToBitmex({
    from: side,
  })

  const { orderQty } = translateAmountToOrderQty({
    amount,
    instrument: market.instrument!,
  })


  let price: number | undefined
  let stopPx: number | undefined

  switch (ordType) {

    case BitmexOrderTypeEnum.LIMIT:
      price = rate
      break

    case BitmexOrderTypeEnum.STOP_MARKET:
      stopPx = stopRate
      break

    case BitmexOrderTypeEnum.STOP_LIMIT:
      stopPx = stopRate
      price = limitRate
      break

    // For market orders no prop is needed
    default:

  }

  const { orderAnnotation } = settings

  const body = {
    orderQty,
    ordType,
    symbol: symbolPair,
    side: translatedSide,
    ...(price ? { price } : {}),
    ...(stopPx ? { stopPx } : {}),
    ...(orderAnnotation ? { text: orderAnnotation } : {}),
  }

  log('placing new order for Bitmex')

  try {

    const bitmexOrder = await http.authedRequest<IBitmexOrder>({
      url: getBitmexEndpoints(settings).order.place,
      body,
      credentials,
    })

    const rawOrder: IBitmexOrderSchema = {
      bitmexOrder,
      market,
    }

    const { order } = exchange.order.parse({ rawOrder })

    const { requestWeight } = http

    return {
      order,
      requestWeight,
    }

  } catch (err) {

    const { message } = err

    let code = AlunaOrderErrorCodes.PLACE_FAILED

    if (/insufficient Available Balance/i.test(message)) {

      code = AlunaBalanceErrorCodes.INSUFFICIENT_BALANCE

    }

    throw new AlunaError({
      ...err,
      code,
    })

  }

}
