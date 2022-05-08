import debug from 'debug'

import { IAlunaExchangePublic } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaMarketListParams,
  IAlunaMarketListRawReturns,
} from '../../../../../lib/modules/public/IAlunaMarketModule'
import {
  IValrMarketCurrencyPairs,
  IValrMarketsSchema,
  IValrMarketSummarySchema,
} from '../../../schemas/IValrMarketSchema'
import { ValrHttp } from '../../../ValrHttp'
import { getValrEndpoints } from '../../../valrSpecs'



const log = debug('@alunajs:valr/market/listRaw')



export const listRaw = (exchange: IAlunaExchangePublic) => async (
  params: IAlunaMarketListParams = {},
): Promise<IAlunaMarketListRawReturns<IValrMarketsSchema>> => {

  const { settings } = exchange

  const { http = new ValrHttp(settings) } = params

  log('fetching Valr markets')

  const summaries = await http.publicRequest<IValrMarketSummarySchema[]>({
    url: getValrEndpoints(settings).market.summaries,
  })

  const pairs = await http.publicRequest<IValrMarketCurrencyPairs[]>({
    url: getValrEndpoints(settings).market.pairs,
  })

  const rawMarkets: IValrMarketsSchema = {
    summaries,
    pairs,
  }

  const { requestCount } = http

  return {
    rawMarkets,
    requestCount,
  }

}
