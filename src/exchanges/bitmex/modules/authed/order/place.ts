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
import {
  IBitmexOrder,
  IBitmexOrderSchema,
} from '../../../schemas/IBitmexOrderSchema'
import { assembleRequestBody } from './helpers/assembleRequestBody'



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
    orderPlaceParams: params,
  })

  const {
    symbolPair,
    http = new BitmexHttp(settings),
  } = params

  const { market } = await exchange.market.get!({
    symbolPair,
    http,
  })

  const { body } = assembleRequestBody({
    action: 'place',
    instrument: market.instrument!,
    orderParams: params,
    settings,
  })

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
