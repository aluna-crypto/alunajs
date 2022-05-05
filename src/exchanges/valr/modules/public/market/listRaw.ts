import debug from 'debug'

import { IAlunaExchangePublic } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaMarketListParams,
  IAlunaMarketListRawReturns,
} from '../../../../../lib/modules/public/IAlunaMarketModule'
import { ValrHttp } from '../../../ValrHttp'
import { valrEndpoints } from '../../../valrSpecs'
import { IValrMarketSchema } from '../../../schemas/IValrMarketSchema'



const log = debug('@alunajs:valr/market/listRaw')



export const listRaw = (exchange: IAlunaExchangePublic) => async (
  params: IAlunaMarketListParams = {},
): Promise<IAlunaMarketListRawReturns<IValrMarketSchema[]>> => {

  const { http = new ValrHttp() } = params

  log('fetching Valr markets')

  // TODO: Implement proper request
  const rawMarkets = await http.publicRequest<IValrMarketSchema[]>({
    url: valrEndpoints.market.list,
  })

  const { requestCount } = http

  return {
    rawMarkets,
    requestCount,
  }

}
