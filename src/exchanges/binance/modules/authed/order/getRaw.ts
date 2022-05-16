import { debug } from 'debug'
import { find } from 'lodash'

import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import { AlunaHttpVerbEnum } from '../../../../../lib/enums/AlunaHtttpVerbEnum'
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
    symbolPair,
    http = new BinanceHttp(settings),
  } = params

  const query = new URLSearchParams()

  query.append('orderId', id)
  query.append('symbol', symbolPair)

  const binanceOrder = await http.authedRequest<IBinanceOrderSchema>({
    credentials,
    verb: AlunaHttpVerbEnum.GET,
    url: getBinanceEndpoints(settings).order.get,
    query: `&${query.toString()}`,
    weight: 2,
  })

  const { rawSymbols } = await exchange.symbol.listRaw({
    http,
  })

  const rawSymbol = find(rawSymbols, {
    symbol: symbolPair,
  })

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
