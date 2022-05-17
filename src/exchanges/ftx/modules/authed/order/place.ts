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
import { translateOrderSideToFtx } from '../../../enums/adapters/ftxOrderSideAdapter'
import { translateOrderTypeToFtx } from '../../../enums/adapters/ftxOrderTypeAdapter'
import { FtxOrderTypeEnum } from '../../../enums/FtxOrderTypeEnum'
import { FtxHttp } from '../../../FtxHttp'
import { getFtxEndpoints } from '../../../ftxSpecs'
import { IFtxOrderSchema } from '../../../schemas/IFtxOrderSchema'



const log = debug('@alunajs:ftx/order/place')



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
    http = new FtxHttp(settings),
  } = params

  const translatedOrderSide = translateOrderSideToFtx({
    from: side,
  })

  const translatedOrderType = translateOrderTypeToFtx({
    from: type,
  })

  const body = {
    side: translatedOrderSide,
    market: symbolPair,
    size: amount,
    type: translatedOrderType,
    price: undefined,
  }

  if (translatedOrderType === FtxOrderTypeEnum.LIMIT) {

    Object.assign(body, {
      price: rate,
    })

  }

  log('placing new order for Ftx')

  let placedOrder: IFtxOrderSchema

  try {

    const orderResponse = await http.authedRequest<IFtxOrderSchema>({
      url: getFtxEndpoints(settings).order.place,
      body,
      credentials,
    })

    placedOrder = orderResponse

  } catch (err) {

    let {
      code,
      message,
    } = err

    const NOT_ENOUGH_BALANCE_MESSAGE = 'Not enough balances'

    if (message === NOT_ENOUGH_BALANCE_MESSAGE) {

      code = AlunaBalanceErrorCodes.INSUFFICIENT_BALANCE

      message = 'Account has insufficient balance for requested action.'

    }

    throw new AlunaError({
      ...err,
      code,
      message,
    })

  }

  const { order } = exchange.order.parse({ rawOrder: placedOrder })

  const { requestWeight } = http

  return {
    order,
    requestWeight,
  }

}
