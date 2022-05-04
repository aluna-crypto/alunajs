import debug from 'debug'

import { IAlunaExchangePublic } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaMarketListParams,
  IAlunaMarketListRawReturns,
} from '../../../../../lib/modules/public/IAlunaMarketModule'
import { SampleHttp } from '../../../SampleHttp'
import { sampleEndpoints } from '../../../sampleSpecs'
import { ISampleMarketSchema } from '../../../schemas/ISampleMarketSchema'



const log = debug('@aluna.js:sample/market/listRaw')



export const listRaw = (exchange: IAlunaExchangePublic) => async (
  params: IAlunaMarketListParams = {},
): Promise<IAlunaMarketListRawReturns<ISampleMarketSchema[]>> => {

  const { http = new SampleHttp() } = params

  log('fetching Sample markets')

  // TODO: Implement proper request
  const rawMarkets = await http.publicRequest<ISampleMarketSchema[]>({
    url: sampleEndpoints.market.list,
  })

  const { requestCount } = http

  return {
    rawMarkets,
    requestCount,
  }

}
