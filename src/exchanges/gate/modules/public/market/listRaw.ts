import debug from 'debug'

import { IAlunaExchangePublic } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaMarketListParams,
  IAlunaMarketListRawReturns,
} from '../../../../../lib/modules/public/IAlunaMarketModule'
import { GateHttp } from '../../../GateHttp'
import { gateEndpoints } from '../../../gateSpecs'
import { IGateMarketSchema } from '../../../schemas/IGateMarketSchema'



const log = debug('@alunajs:gate/market/listRaw')



export const listRaw = (exchange: IAlunaExchangePublic) => async (
  params: IAlunaMarketListParams = {},
): Promise<IAlunaMarketListRawReturns<IGateMarketSchema[]>> => {

  const { http = new GateHttp() } = params

  log('fetching Gate markets')

  // TODO: Implement proper request
  const rawMarkets = await http.publicRequest<IGateMarketSchema[]>({
    url: gateEndpoints.market.list,
  })

  const { requestCount } = http

  return {
    rawMarkets,
    requestCount,
  }

}
