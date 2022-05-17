import debug from 'debug'

import { IAlunaExchangePublic } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaMarketListParams,
  IAlunaMarketListRawReturns,
} from '../../../../../lib/modules/public/IAlunaMarketModule'
import { BinanceHttp } from '../../../BinanceHttp'
import { getBinanceEndpoints } from '../../../binanceSpecs'
import {
  IBinanceMarketSchema,
  IBinanceMarketsResponseSchema,
} from '../../../schemas/IBinanceMarketSchema'



const log = debug('alunajs:binance/market/listRaw')



export const listRaw = (exchange: IAlunaExchangePublic) => async (
  params: IAlunaMarketListParams = {},
): Promise<IAlunaMarketListRawReturns<IBinanceMarketsResponseSchema>> => {

  const { settings } = exchange

  const { http = new BinanceHttp(settings) } = params

  log('fetching Binance markets')

  const rawTickers = await http.publicRequest<IBinanceMarketSchema[]>({
    url: getBinanceEndpoints(settings).market.list,
    weight: 40,
  })

  const { rawSymbols } = await exchange.symbol.listRaw({
    http,
  })

  const rawMarkets: IBinanceMarketsResponseSchema = {
    rawTickers,
    rawSymbols,
  }

  const { requestWeight } = http

  return {
    rawMarkets,
    requestWeight,
  }

}
