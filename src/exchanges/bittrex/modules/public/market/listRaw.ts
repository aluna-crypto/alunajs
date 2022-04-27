import debug from 'debug'

import {
  IAlunaMarketListParams,
  IAlunaMarketListRawReturns,
} from '../../../../../lib/modules/public/IAlunaMarketModule'
import { BittrexHttp } from '../../../BittrexHttp'
import { BITTREX_PRODUCTION_URL } from '../../../bittrexSpecs'
import {
  IBittrexMarketInfoSchema,
  IBittrexMarketsSchema,
  IBittrexMarketSummarySchema,
  IBittrexMarketTickerSchema,
} from '../../../schemas/IBittrexMarketSchema'



const log = debug('@aluna.js:bittrex/market/listRaw')



export async function listRaw (
  params: IAlunaMarketListParams = {},
): Promise<IAlunaMarketListRawReturns<IBittrexMarketsSchema>> {

  const { http = new BittrexHttp() } = params

  log('fetching Bittrex markets')

  const marketsInfo = await http.publicRequest<IBittrexMarketInfoSchema[]>({
    url: `${BITTREX_PRODUCTION_URL}/markets`,
  })

  const summaries = await http.publicRequest<IBittrexMarketSummarySchema[]>({
    url: `${BITTREX_PRODUCTION_URL}/markets/summaries`,
  })

  const tickers = await http.publicRequest<IBittrexMarketTickerSchema[]>({
    url: `${BITTREX_PRODUCTION_URL}/markets/tickers`,
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
