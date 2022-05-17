import { debug } from 'debug'
import { find } from 'lodash'

import { AlunaError } from '../../../../../lib/core/AlunaError'
import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import { AlunaAccountEnum } from '../../../../../lib/enums/AlunaAccountEnum'
import { AlunaHttpVerbEnum } from '../../../../../lib/enums/AlunaHtttpVerbEnum'
import { AlunaGenericErrorCodes } from '../../../../../lib/errors/AlunaGenericErrorCodes'
import {
  IAlunaOrderGetParams,
  IAlunaOrderGetRawReturns,
} from '../../../../../lib/modules/authed/IAlunaOrderModule'
import { BinanceHttp } from '../../../BinanceHttp'
import { getBinanceEndpoints } from '../../../binanceSpecs'
import {
  IBinanceOrderResponseSchema,
  IBinanceOrderSchema,
} from '../../../schemas/IBinanceOrderSchema'



const log = debug('@alunajs:binance/order/getRaw')



export const getRaw = (exchange: IAlunaExchangeAuthed) => async (
  params: IAlunaOrderGetParams,
): Promise<IAlunaOrderGetRawReturns<IBinanceOrderResponseSchema>> => {

  log('getting raw order', params)

  const {
    settings,
    credentials,
  } = exchange

  const {
    id,
    account,
    symbolPair,
    http = new BinanceHttp(settings),
  } = params

  if (!account) {

    const error = new AlunaError({
      code: AlunaGenericErrorCodes.PARAM_ERROR,
      message: 'Order account is required to cancel Binance orders',
      httpStatusCode: 400,
    })

    log(error)

    throw error

  }

  const orderEndpoints = getBinanceEndpoints(settings).order

  let url: string
  let weight: number

  if (account === AlunaAccountEnum.SPOT) {

    url = orderEndpoints.spot
    weight = 2

  } else {

    url = orderEndpoints.margin
    weight = 10

  }

  const query = new URLSearchParams()

  query.append('orderId', id)
  query.append('symbol', symbolPair)

  const binanceOrder = await http.authedRequest<IBinanceOrderSchema>({
    credentials,
    verb: AlunaHttpVerbEnum.GET,
    url,
    query,
    weight,
  })

  const { rawSymbols } = await exchange.symbol.listRaw({
    http,
  })

  const rawSymbol = find(rawSymbols, { symbol: symbolPair })

  const rawOrder: IBinanceOrderResponseSchema = {
    binanceOrder,
    rawSymbol,
  }

  const { requestWeight } = http

  return {
    rawOrder,
    requestWeight,
  }

}
