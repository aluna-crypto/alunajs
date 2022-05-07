import debug from 'debug'

import { IAlunaExchangePublic } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaMarketListParams,
  IAlunaMarketListRawReturns,
} from '../../../../../lib/modules/public/IAlunaMarketModule'
import { BitfinexHttp } from '../../../BitfinexHttp'
import { bitfinexEndpoints } from '../../../bitfinexSpecs'
import {
  IBitfinexMarketsSchema,
  IBitfinexTicker,
} from '../../../schemas/IBitfinexMarketSchema'



const log = debug('@alunajs:bitfinex/market/listRaw')



export const listRaw = (exchange: IAlunaExchangePublic) => async (
  params: IAlunaMarketListParams = {},
): Promise<IAlunaMarketListRawReturns<IBitfinexMarketsSchema>> => {

  const { http = new BitfinexHttp(exchange.settings) } = params

  log('fetching Bitfinex markets')

  const tickers = await http.publicRequest<IBitfinexTicker[]>({
    url: bitfinexEndpoints.market.tickers,
  })

  const enabledMarginCurrencies = await http.publicRequest<string[][]>({
    url: bitfinexEndpoints.market.enabledMarginCurrencies,
  })

  const rawMarkets: IBitfinexMarketsSchema = {
    tickers,
    enabledMarginCurrencies,
  }

  const { requestCount } = http

  return {
    rawMarkets,
    requestCount,
  }

}
