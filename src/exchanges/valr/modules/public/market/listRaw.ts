import debug from 'debug'

import { IAlunaExchangePublic } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaMarketListParams,
  IAlunaMarketListRawReturns,
} from '../../../../../lib/modules/public/IAlunaMarketModule'
import { ValrHttp } from '../../../ValrHttp'
import { valrEndpoints } from '../../../valrSpecs'
import {
  IValrMarketCurrencyPairs, IValrMarketsSchema, IValrMarketSummarySchema,
} from '../../../schemas/IValrMarketSchema'



const log = debug('@alunajs:valr/market/listRaw')



export const listRaw = (exchange: IAlunaExchangePublic) => async (
  params: IAlunaMarketListParams = {},
): Promise<IAlunaMarketListRawReturns<IValrMarketsSchema>> => {

  const { http = new ValrHttp() } = params

  log('fetching Valr markets')

  const summaries = await http.publicRequest<IValrMarketSummarySchema[]>({
    url: valrEndpoints.market.summaries,
  })

  const pairs = await http.publicRequest<IValrMarketCurrencyPairs[]>({
    url: valrEndpoints.market.pairs,
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
