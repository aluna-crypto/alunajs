import debug from 'debug'

import { IAlunaExchangePublic } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaMarketListParams,
  IAlunaMarketListRawReturns,
} from '../../../../../lib/modules/public/IAlunaMarketModule'
import { SampleHttp } from '../../../SampleHttp'
import { getSampleEndpoints } from '../../../sampleSpecs'
import { ISampleMarketSchema } from '../../../schemas/ISampleMarketSchema'



const log = debug('alunajs:sample/market/listRaw')



export const listRaw = (exchange: IAlunaExchangePublic) => async (
  params: IAlunaMarketListParams = {},
): Promise<IAlunaMarketListRawReturns<ISampleMarketSchema[]>> => {

  const { settings } = exchange

  const { http = new SampleHttp(settings) } = params

  log('fetching Sample markets')

  // TODO: Implement proper request
  const rawMarkets = await http.publicRequest<ISampleMarketSchema[]>({
    url: getSampleEndpoints(settings).market.list,
  })

  const { requestWeight } = http

  return {
    rawMarkets,
    requestWeight,
  }

}
