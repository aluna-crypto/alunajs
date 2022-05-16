import debug from 'debug'

import { IAlunaExchangePublic } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaMarketListParams,
  IAlunaMarketListRawReturns,
} from '../../../../../lib/modules/public/IAlunaMarketModule'
import { PoloniexHttp } from '../../../PoloniexHttp'
import { getPoloniexEndpoints } from '../../../poloniexSpecs'
import { IPoloniexMarketResponseSchema } from '../../../schemas/IPoloniexMarketSchema'



const log = debug('@alunajs:poloniex/market/listRaw')



export const listRaw = (exchange: IAlunaExchangePublic) => async (
  params: IAlunaMarketListParams = {},
): Promise<IAlunaMarketListRawReturns<IPoloniexMarketResponseSchema>> => {

  const { settings } = exchange

  const { http = new PoloniexHttp(settings) } = params

  const query = new URLSearchParams()

  query.append('command', 'returnTicker')

  log('fetching Poloniex markets')

  const rawMarkets = await http.publicRequest<IPoloniexMarketResponseSchema>({
    url: getPoloniexEndpoints(settings).market.list(query.toString()),
  })

  const { requestWeight } = http

  return {
    rawMarkets,
    requestWeight,
  }

}
