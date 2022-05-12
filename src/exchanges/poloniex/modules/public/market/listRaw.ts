import debug from 'debug'

import { IAlunaExchangePublic } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaMarketListParams,
  IAlunaMarketListRawReturns,
} from '../../../../../lib/modules/public/IAlunaMarketModule'
import { PoloniexHttp } from '../../../PoloniexHttp'
import { getPoloniexEndpoints } from '../../../poloniexSpecs'
import { IPoloniexMarketSchema } from '../../../schemas/IPoloniexMarketSchema'



const log = debug('@alunajs:poloniex/market/listRaw')



export const listRaw = (exchange: IAlunaExchangePublic) => async (
  params: IAlunaMarketListParams = {},
): Promise<IAlunaMarketListRawReturns<IPoloniexMarketSchema[]>> => {

  const { settings } = exchange

  const { http = new PoloniexHttp(settings) } = params

  log('fetching Poloniex markets')

  // TODO: Implement proper request
  const rawMarkets = await http.publicRequest<IPoloniexMarketSchema[]>({
    url: getPoloniexEndpoints(settings).market.list,
  })

  const { requestWeight } = http

  return {
    rawMarkets,
    requestWeight,
  }

}
