import debug from 'debug'

import { IAlunaExchangePublic } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaMarketListParams,
  IAlunaMarketListRawReturns,
} from '../../../../../lib/modules/public/IAlunaMarketModule'
import { BittrexHttp } from '../../../BittrexHttp'
import { bittrexEndpoints } from '../../../bittrexSpecs'
import {
  IBittrexMarketInfoSchema,
  IBittrexMarketsSchema,
  IBittrexMarketSummarySchema,
  IBittrexMarketTickerSchema,
} from '../../../schemas/IBittrexMarketSchema'



const log = debug('@alunajs:bittrex/market/listRaw')



export const listRaw = (exchange: IAlunaExchangePublic) => async (
  params: IAlunaMarketListParams = {},
): Promise<IAlunaMarketListRawReturns<IBittrexMarketsSchema>> => {

  const { http = new BittrexHttp(exchange.settings) } = params

  log('fetching Bittrex markets')

  const marketsInfo = await http.publicRequest<IBittrexMarketInfoSchema[]>({
    url: bittrexEndpoints.market.markets,
  })

  const summaries = await http.publicRequest<IBittrexMarketSummarySchema[]>({
    url: bittrexEndpoints.market.summaries,
  })

  const tickers = await http.publicRequest<IBittrexMarketTickerSchema[]>({
    url: bittrexEndpoints.market.tickers,
  })


  const rawMarkets: IBittrexMarketsSchema = {
    marketsInfo,
    summaries,
    tickers,
  }

  const { requestCount } = http

  return {
    rawMarkets,
    requestCount,
  }

}
