import debug from 'debug'

import { IAlunaExchangePublic } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaMarketListParams,
  IAlunaMarketListRawReturns,
} from '../../../../../lib/modules/public/IAlunaMarketModule'
import { BittrexHttp } from '../../../BittrexHttp'
import { getBittrexEndpoints } from '../../../bittrexSpecs'
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

  log('fetching Bittrex markets')

  const { settings } = exchange

  const { http = new BittrexHttp(settings) } = params

  const urls = getBittrexEndpoints(settings)

  const marketsInfo = await http.publicRequest<IBittrexMarketInfoSchema[]>({
    url: urls.market.markets,
  })

  const summaries = await http.publicRequest<IBittrexMarketSummarySchema[]>({
    url: urls.market.summaries,
  })

  const tickers = await http.publicRequest<IBittrexMarketTickerSchema[]>({
    url: urls.market.tickers,
  })

  const rawMarkets: IBittrexMarketsSchema = {
    marketsInfo,
    summaries,
    tickers,
  }

  const { requestWeight } = http

  return {
    rawMarkets,
    requestWeight,
  }

}
