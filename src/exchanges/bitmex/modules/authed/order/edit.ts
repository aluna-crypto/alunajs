import { debug } from 'debug'

import { AlunaError } from '../../../../../lib/core/AlunaError'
import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import { AlunaHttpVerbEnum } from '../../../../../lib/enums/AlunaHtttpVerbEnum'
import { AlunaBalanceErrorCodes } from '../../../../../lib/errors/AlunaBalanceErrorCodes'
import {
  IAlunaOrderEditParams,
  IAlunaOrderEditReturns,
} from '../../../../../lib/modules/authed/IAlunaOrderModule'
import { ensureOrderIsSupported } from '../../../../../utils/orders/ensureOrderIsSupported'
import { editOrderParamsSchema } from '../../../../../utils/validation/schemas/editOrderParamsSchema'
import { validateParams } from '../../../../../utils/validation/validateParams'
import { BitmexHttp } from '../../../BitmexHttp'
import { getBitmexEndpoints } from '../../../bitmexSpecs'
import { translateOrderTypeToBitmex } from '../../../enums/adapters/bitmexOrderTypeAdapter'
import { BitmexOrderTypeEnum } from '../../../enums/BitmexOrderTypeEnum'
import {
  IBitmexOrder,
  IBitmexOrderSchema,
} from '../../../schemas/IBitmexOrderSchema'
import { translateAmountToOrderQty } from './helpers/translateAmountToOrderQty'



const log = debug('alunajs:bitmex/order/edit')



export const edit = (exchange: IAlunaExchangeAuthed) => async (
  params: IAlunaOrderEditParams,
): Promise<IAlunaOrderEditReturns> => {

  log('editing order', params)

  const {
    specs,
    settings,
    credentials,
  } = exchange

  validateParams({
    params,
    schema: editOrderParamsSchema,
  })

  ensureOrderIsSupported({
    exchangeSpecs: specs,
    orderParams: params,
  })

  log('editing order for Bitmex')

  const {
    symbolPair,
    id,
    amount,
    type,
    rate,
    limitRate,
    stopRate,
    http = new BitmexHttp(exchange.settings),
  } = params

  const { market } = await exchange.market.get!({
    symbolPair,
    http,
  })

  const ordType = translateOrderTypeToBitmex({
    from: type,
  })

  const { orderQty } = translateAmountToOrderQty({
    amount,
    instrument: market.instrument!,
  })


  let price: number | undefined
  let stopPx: number | undefined

  switch (ordType) {

    case BitmexOrderTypeEnum.STOP_MARKET:
      stopPx = stopRate
      break

    case BitmexOrderTypeEnum.STOP_LIMIT:
      stopPx = stopRate
      price = limitRate
      break

    // Limit order
    default:
      price = rate

  }

  const body = {
    orderQty,
    orderID: id,
    ...(price ? { price } : {}),
    ...(stopPx ? { stopPx } : {}),
  }

  try {

    const bitmexOrder = await http.authedRequest<IBitmexOrder>({
      url: getBitmexEndpoints(settings).order.edit,
      verb: AlunaHttpVerbEnum.PUT,
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

    let { code } = err

    if (/insufficient Available Balance/i.test(message)) {

      code = AlunaBalanceErrorCodes.INSUFFICIENT_BALANCE

    }

    throw new AlunaError({
      ...err,
      code,
    })

  }

}
