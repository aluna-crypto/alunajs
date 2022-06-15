import { debug } from 'debug'
import { isArray } from 'lodash'

import { AlunaError } from '../../../../../lib/core/AlunaError'
import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import { AlunaAccountEnum } from '../../../../../lib/enums/AlunaAccountEnum'
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
import { translateOrderSideToOkx } from '../../../enums/adapters/okxOrderSideAdapter'
import { translateOrderTypeToOkx } from '../../../enums/adapters/okxOrderTypeAdapter'
import { OkxOrderTypeEnum } from '../../../enums/OkxOrderTypeEnum'
import { OkxHttp } from '../../../OkxHttp'
import { getOkxEndpoints } from '../../../okxSpecs'
import { IOkxOrderPlaceResponseSchema } from '../../../schemas/IOkxOrderSchema'



const log = debug('alunajs:okx/order/place')



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
    account,
    side,
    type,
    stopRate,
    limitRate,
    http = new OkxHttp(settings),
  } = params

  const translatedOrderType = translateOrderTypeToOkx({
    from: type,
  })

  const translatedOrderSide = translateOrderSideToOkx({ from: side })

  const tdMode = account === AlunaAccountEnum.MARGIN ? 'cross' : 'cash'

  const body = {
    side: translatedOrderSide,
    instId: symbolPair,
    ordType: translatedOrderType,
    sz: amount.toString(),
    tdMode,
  }

  if (translatedOrderType === OkxOrderTypeEnum.LIMIT) {

    Object.assign(body, {
      px: rate!.toString(),
    })

  }

  if (translatedOrderType === OkxOrderTypeEnum.CONDITIONAL) {

    if (type === AlunaOrderTypesEnum.STOP_MARKET) {

      Object.assign(body, {
        slOrdPx: '-1',
      })

    } else {

      Object.assign(body, {
        slOrdPx: stopRate!.toString(),
      })

    }

    Object.assign(body, {
      slTriggerPx: limitRate!.toString(),
    })

  }

  log('placing new order for Okx')

  let placedOrderId: string

  try {

    const orderEndpoints = getOkxEndpoints(settings).order

    const url = translatedOrderType === OkxOrderTypeEnum.CONDITIONAL
      ? orderEndpoints.placeStop
      : orderEndpoints.place

    const [orderResponse] = await http.authedRequest<IOkxOrderPlaceResponseSchema[]>({
      url,
      body,
      credentials,
    })

    placedOrderId = orderResponse.ordId || orderResponse.algoId

  } catch (err) {

    let {
      code,
      message,
    } = err

    const { metadata } = err

    const INSUFFICIENT_BALANCE_CODE = '51008'

    const isInsufficientBalanceError = isArray(metadata)
      ? metadata[0].sCode === INSUFFICIENT_BALANCE_CODE
      : metadata.sCode === INSUFFICIENT_BALANCE_CODE


    if (isInsufficientBalanceError) {

      code = AlunaBalanceErrorCodes.INSUFFICIENT_BALANCE

      message = 'Account has insufficient balance for requested action.'

    } else {

      code = AlunaOrderErrorCodes.PLACE_FAILED

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
    type,
    http,
  })

  const { requestWeight } = http

  return {
    order,
    requestWeight,
  }

}
