import { debug } from 'debug'
import { concat } from 'lodash'

import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import { AlunaHttpVerbEnum } from '../../../../../lib/enums/AlunaHtttpVerbEnum'
import {
  IAlunaOrderListParams,
  IAlunaOrderListRawReturns,
} from '../../../../../lib/modules/authed/IAlunaOrderModule'
import { BinanceHttp } from '../../../BinanceHttp'
import { getBinanceEndpoints } from '../../../binanceSpecs'
import {
  IBinanceOrderSchema,
  IBinanceOrdersResponseSchema,
} from '../../../schemas/IBinanceOrderSchema'



const log = debug('@alunajs:binance/order/listRaw')



export const listRaw = (exchange: IAlunaExchangeAuthed) => async (
  params: IAlunaOrderListParams = {},
): Promise<IAlunaOrderListRawReturns<IBinanceOrdersResponseSchema>> => {

  log('fetching Binance open orders', params)

  const {
    settings,
    credentials,
  } = exchange

  const { http = new BinanceHttp(settings) } = params

  const spotOrders = await http.authedRequest<IBinanceOrderSchema[]>({
    verb: AlunaHttpVerbEnum.GET,
    url: getBinanceEndpoints(settings).order.spot,
    credentials,
    weight: 40,
  })

  const marginOrders = await http.authedRequest<IBinanceOrderSchema[]>({
    verb: AlunaHttpVerbEnum.GET,
    url: getBinanceEndpoints(settings).order.margin,
    credentials,
    weight: 10,
  })

  const { rawSymbols } = await exchange.symbol.listRaw({
    http,
  })

  const binanceOrders = concat(spotOrders, marginOrders)

  const rawOrdersResponse: IBinanceOrdersResponseSchema = {
    binanceOrders,
    rawSymbols,
  }

  const { requestWeight } = http

  return {
    rawOrders: rawOrdersResponse,
    requestWeight,
  }

}
