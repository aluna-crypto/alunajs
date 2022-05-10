import debug from 'debug'

import { IAlunaExchangePublic } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaMarketListParams,
  IAlunaMarketListRawReturns,
} from '../../../../../lib/modules/public/IAlunaMarketModule'
import { BinanceHttp } from '../../../BinanceHttp'
import { getBinanceEndpoints } from '../../../binanceSpecs'
import { IBinanceMarketSchema } from '../../../schemas/IBinanceMarketSchema'



const log = debug('@alunajs:binance/market/listRaw')



export const listRaw = (exchange: IAlunaExchangePublic) => async (
  params: IAlunaMarketListParams = {},
): Promise<IAlunaMarketListRawReturns<IBinanceMarketSchema[]>> => {

  const { settings } = exchange

  const { http = new BinanceHttp(settings) } = params

  log('fetching Binance markets')

  // TODO: Implement proper request
  const rawMarkets = await http.publicRequest<IBinanceMarketSchema[]>({
    url: getBinanceEndpoints(settings).market.list,
  })

  const { requestCount } = http

  return {
    rawMarkets,
    requestCount,
  }

}
