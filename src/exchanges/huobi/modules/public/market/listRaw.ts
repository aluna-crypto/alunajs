import debug from 'debug'

import { IAlunaExchangePublic } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaMarketListParams,
  IAlunaMarketListRawReturns,
} from '../../../../../lib/modules/public/IAlunaMarketModule'
import { HuobiHttp } from '../../../HuobiHttp'
import { getHuobiEndpoints } from '../../../huobiSpecs'
import { IHuobiMarketSchema } from '../../../schemas/IHuobiMarketSchema'



const log = debug('alunajs:huobi/market/listRaw')



export const listRaw = (exchange: IAlunaExchangePublic) => async (
  params: IAlunaMarketListParams = {},
): Promise<IAlunaMarketListRawReturns<IHuobiMarketSchema[]>> => {

  const { settings } = exchange

  const { http = new HuobiHttp(settings) } = params

  log('fetching Huobi markets')

  // TODO: Implement proper request
  const rawMarkets = await http.publicRequest<IHuobiMarketSchema[]>({
    url: getHuobiEndpoints(settings).market.list,
  })

  const { requestWeight } = http

  return {
    rawMarkets,
    requestWeight,
  }

}
