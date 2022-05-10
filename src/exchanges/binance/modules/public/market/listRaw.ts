import debug from 'debug'

import { IAlunaExchangePublic } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaMarketListParams,
  IAlunaMarketListRawReturns,
} from '../../../../../lib/modules/public/IAlunaMarketModule'
import { binanceHttp } from '../../../binanceHttp'
import { getbinanceEndpoints } from '../../../binanceSpecs'
import { IbinanceMarketSchema } from '../../../schemas/IbinanceMarketSchema'



const log = debug('@alunajs:binance/market/listRaw')



export const listRaw = (exchange: IAlunaExchangePublic) => async (
  params: IAlunaMarketListParams = {},
): Promise<IAlunaMarketListRawReturns<IbinanceMarketSchema[]>> => {

  const { settings } = exchange

  const { http = new binanceHttp(settings) } = params

  log('fetching binance markets')

  // TODO: Implement proper request
  const rawMarkets = await http.publicRequest<IbinanceMarketSchema[]>({
    url: getbinanceEndpoints(settings).market.list,
  })

  const { requestCount } = http

  return {
    rawMarkets,
    requestCount,
  }

}
