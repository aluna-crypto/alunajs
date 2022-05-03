import debug from 'debug'

import { IAlunaExchangePublic } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaMarketListParams,
  IAlunaMarketListRawReturns,
} from '../../../../../lib/modules/public/IAlunaMarketModule'
import { SampleHttp } from '../../../SampleHttp'
import { SAMPLE_PRODUCTION_URL } from '../../../sampleSpecs'
import {
  ISampleMarketInfoSchema,
  ISampleMarketsSchema,
  ISampleMarketSummarySchema,
  ISampleMarketTickerSchema,
} from '../../../schemas/ISampleMarketSchema'



const log = debug('@aluna.js:sample/market/listRaw')



export const listRaw = (exchange: IAlunaExchangePublic) => async (
  params: IAlunaMarketListParams = {},
): Promise<IAlunaMarketListRawReturns<ISampleMarketsSchema>> => {

  const { http = new SampleHttp() } = params

  log('fetching Sample markets')

  const marketsInfo = await http.publicRequest<ISampleMarketInfoSchema[]>({
    url: `${SAMPLE_PRODUCTION_URL}/markets`,
  })

  const summaries = await http.publicRequest<ISampleMarketSummarySchema[]>({
    url: `${SAMPLE_PRODUCTION_URL}/markets/summaries`,
  })

  const tickers = await http.publicRequest<ISampleMarketTickerSchema[]>({
    url: `${SAMPLE_PRODUCTION_URL}/markets/tickers`,
  })


  const rawMarkets: ISampleMarketsSchema = {
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
