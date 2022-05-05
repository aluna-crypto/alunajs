import debug from 'debug'

import { IAlunaExchangePublic } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaMarketListParams,
  IAlunaMarketListRawReturns,
} from '../../../../../lib/modules/public/IAlunaMarketModule'
import { BitfinexHttp } from '../../../BitfinexHttp'
import { bitfinexEndpoints } from '../../../bitfinexSpecs'
import { IBitfinexMarketSchema } from '../../../schemas/IBitfinexMarketSchema'



const log = debug('@alunajs:bitfinex/market/listRaw')



export const listRaw = (exchange: IAlunaExchangePublic) => async (
  params: IAlunaMarketListParams = {},
): Promise<IAlunaMarketListRawReturns<IBitfinexMarketSchema[]>> => {

  const { http = new BitfinexHttp() } = params

  log('fetching Bitfinex markets')

  // TODO: Implement proper request
  const rawMarkets = await http.publicRequest<IBitfinexMarketSchema[]>({
    url: bitfinexEndpoints.market.list,
  })

  const { requestCount } = http

  return {
    rawMarkets,
    requestCount,
  }

}
