import debug from 'debug'

import {
  IAlunaMarketListParams,
  IAlunaMarketListRawReturns,
} from '../../../../../lib/modules/public/IAlunaMarketModule'
import { BittrexHttp } from '../../../BittrexHttp'
import { BITTREX_PRODUCTION_URL } from '../../../bittrexSpecs'
import {
  IBittrexMarketSchema,
  IBittrexMarketSummarySchema,
  IBittrexMarketTickerSchema,
} from '../../../schemas/IBittrexMarketSchema'



const log = debug('@aluna.js:bittrex/market/listRaw')



export async function listRaw (
  params: IAlunaMarketListParams = {},
): Promise<IAlunaMarketListRawReturns<IBittrexMarketSchema>> {

  const { http = new BittrexHttp() } = params

  log('fetching Bittrex raw summaries')

  const summaries = await http.publicRequest<IBittrexMarketSummarySchema[]>({
    url: `${BITTREX_PRODUCTION_URL}/markets/summaries`,
  })

  log('fetching Bittrex raw tickers')

  const tickers = await http.publicRequest<IBittrexMarketTickerSchema[]>({
    url: `${BITTREX_PRODUCTION_URL}/markets/tickers`,
  })

  const rawMarkets: IBittrexMarketSchema = {
    summaries,
    tickers,
  }

  const { requestCount } = http

  return {
    rawMarkets,
    requestCount,
  }

}
