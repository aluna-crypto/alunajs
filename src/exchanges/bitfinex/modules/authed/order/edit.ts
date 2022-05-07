import { debug } from 'debug'

import { AlunaError } from '../../../../../lib/core/AlunaError'
import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import { AlunaOrderTypesEnum } from '../../../../../lib/enums/AlunaOrderTypesEnum'
import { AlunaBalanceErrorCodes } from '../../../../../lib/errors/AlunaBalanceErrorCodes'
import { AlunaHttpErrorCodes } from '../../../../../lib/errors/AlunaHttpErrorCodes'
import { AlunaOrderErrorCodes } from '../../../../../lib/errors/AlunaOrderErrorCodes'
import {
  IAlunaOrderEditParams,
  IAlunaOrderEditReturns,
} from '../../../../../lib/modules/authed/IAlunaOrderModule'
import { editOrderParamsSchema } from '../../../../../utils/validation/schemas/editOrderParamsSchema'
import { validateParams } from '../../../../../utils/validation/validateParams'
import { BitfinexHttp } from '../../../BitfinexHttp'
import { bitfinexEndpoints } from '../../../bitfinexSpecs'
import { translateOrderSideToBitfinex } from '../../../enums/adapters/bitfinexOrderSideAdapter'
import {
  IBitfinexOrderSchema,
  TBitfinexEditCancelOrderResponse,
} from '../../../schemas/IBitfinexOrderSchema'



const log = debug('@alunajs:bitfinex/order/edit')



export const edit = (exchange: IAlunaExchangeAuthed) => async (
  params: IAlunaOrderEditParams,
): Promise<IAlunaOrderEditReturns> => {

  log('editing order', params)

  const { credentials } = exchange

  validateParams({
    params,
    schema: editOrderParamsSchema,
  })

  log('editing order for Bitfinex')

  const {
    id,
    rate,
    side,
    type,
    amount,
    stopRate,
    limitRate,
    http = new BitfinexHttp(),
  } = params

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

  const body = {
    amount: translatedAmount,
    id: Number(id),
    ...(price ? { price } : {}),
    ...(priceAuxLimit ? { price_aux_limit: priceAuxLimit } : {}),
  }

  log('editing order for Bitfinex')

  let rawOrder: IBitfinexOrderSchema

  try {

    const response = await http.authedRequest<TBitfinexEditCancelOrderResponse>({
      url: bitfinexEndpoints.order.edit,
      body,
      credentials,
    })

    const [
      _mts,
      _type,
      _messageId,
      _placeHolder,
      editedOrder,
      _code,
      status,
      text,
    ] = response

    if (status !== 'SUCCESS') {

      throw new AlunaError({
        code: AlunaHttpErrorCodes.REQUEST_ERROR,
        message: text,
        metadata: response,
      })

    }

    // Bitfinex already returns the order edited/updated
    rawOrder = editedOrder

    const { order } = exchange.order.parse({ rawOrder })

    const { requestCount } = http

    return {
      order,
      requestCount,
    }

  } catch (err) {

    const { httpStatusCode, metadata } = err

    let {
      code,
      message,
    } = err

    if (/order: invalid/.test(err.message)) {

      code = AlunaOrderErrorCodes.NOT_FOUND
      message = 'order was not found or may not be open'

    } else if (/not enough.+balance/i.test(err.message)) {

      code = AlunaBalanceErrorCodes.INSUFFICIENT_BALANCE

    }

    const error = new AlunaError({
      message,
      code,
      metadata,
      httpStatusCode,
    })

    log(error)

    throw error

  }
}
