import debug from 'debug'
import {
  assign,
  filter,
  keyBy,
} from 'lodash'

import {
  IAlunaMarketListParams,
  IAlunaMarketListRawReturns,
} from '../../../../../lib/modules/public/IAlunaMarketModule'
import { BittrexHttp } from '../../../BittrexHttp'
import { BITTREX_PRODUCTION_URL } from '../../../bittrexSpecs'
import {
  IBittrexMarketSummarySchema,
  IBittrexMarketTickerSchema,
} from '../../../schemas/IBittrexMarketSchema'



const log = debug('@aluna.js:bittrex/market/listRaw')



export async function listRaw (
  params: IAlunaMarketListParams = {},
): Promise<IAlunaMarketListRawReturns> {

  const {
    http = new BittrexHttp(),
  } = params

  log('fetching Bittrex market summaries')

  let rawMarkets = await http.publicRequest<IBittrexMarketSummarySchema[]>({
    url: `${BITTREX_PRODUCTION_URL}/markets/summaries`,
  })

  log('fetching Bittrex tickers')

  const tickers = await http.publicRequest<IBittrexMarketTickerSchema[]>({
    url: `${BITTREX_PRODUCTION_URL}/markets/tickers`,
  })

  const tickersDictionary = keyBy(tickers, 'symbol')

  rawMarkets = filter(rawMarkets, (rawMarket) => {

    const { symbol } = rawMarket

    const ticker = tickersDictionary[symbol]

    if (ticker) {

      assign(rawMarket, {
        ...ticker,
      })

    }

    return !!ticker

  })

  const { requestCount } = http

  return {
    rawMarkets,
    requestCount,
  }

}
