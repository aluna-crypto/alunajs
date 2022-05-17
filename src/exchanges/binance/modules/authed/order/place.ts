import { debug } from 'debug'
import { find } from 'lodash'

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
import { BinanceHttp } from '../../../BinanceHttp'
import { getBinanceEndpoints } from '../../../binanceSpecs'
import { translateOrderSideToBinance } from '../../../enums/adapters/binanceOrderSideAdapter'
import { translateOrderTypeToBinance } from '../../../enums/adapters/binanceOrderTypeAdapter'
import { BinanceOrderTimeInForceEnum } from '../../../enums/BinanceOrderTimeInForceEnum'
import { BinanceOrderTypeEnum } from '../../../enums/BinanceOrderTypeEnum'
import {
  IBinanceOrderResponseSchema,
  IBinanceOrderSchema,
} from '../../../schemas/IBinanceOrderSchema'



const log = debug('@alunajs:binance/order/place')



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
    http = new BinanceHttp(settings),
  } = params

  const translatedOrderType = translateOrderTypeToBinance({
    from: type,
  })

  const traslatedOrderSide = translateOrderSideToBinance({ from: side })

  const query = new URLSearchParams()

  query.append('side', traslatedOrderSide)
  query.append('symbol', symbolPair)
  query.append('type', translatedOrderType)
  query.append('quantity', amount.toString())


  if (translatedOrderType === BinanceOrderTypeEnum.LIMIT) {

    query.append('price', rate!.toString())
    query.append('timeInForce', BinanceOrderTimeInForceEnum.GOOD_TIL_CANCELED)

  }

  log('placing new order for Binance')

  let binanceOrder: IBinanceOrderSchema

  try {

    binanceOrder = await http.authedRequest<IBinanceOrderSchema>({
      url: getBinanceEndpoints(settings).order.place,
      query,
      credentials,
      weight: 1,
    })

    const { rawSymbols } = await exchange.symbol.listRaw({
      http,
    })

    const rawSymbol = find(rawSymbols, { symbol: symbolPair })

    const rawOrderRequest: IBinanceOrderResponseSchema = {
      rawSymbol,
      binanceOrder,
    }

    const { order } = exchange.order.parse({ rawOrder: rawOrderRequest })

    const { requestWeight } = http

    return {
      order,
      requestWeight,
    }

  } catch (err) {

    let {
      code,
      message,
    } = err

    const { metadata } = err

    if (metadata.code === -2010) {

      code = AlunaBalanceErrorCodes.INSUFFICIENT_BALANCE

      message = 'Account has insufficient balance for requested action.'

    }

    throw new AlunaError({
      ...err,
      code,
      message,
    })

  }

}
