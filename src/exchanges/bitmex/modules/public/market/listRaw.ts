import debug from 'debug'

import { IAlunaExchangePublic } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaMarketListParams,
  IAlunaMarketListRawReturns,
} from '../../../../../lib/modules/public/IAlunaMarketModule'
import { BitmexHttp } from '../../../BitmexHttp'
import { getBitmexEndpoints } from '../../../bitmexSpecs'
import { IBitmexMarketSchema } from '../../../schemas/IBitmexMarketSchema'



const log = debug('@alunajs:bitmex/market/listRaw')



export const listRaw = (exchange: IAlunaExchangePublic) => async (
  params: IAlunaMarketListParams = {},
): Promise<IAlunaMarketListRawReturns<IBitmexMarketSchema[]>> => {

  const { settings } = exchange

  const { http = new BitmexHttp(settings) } = params

  log('fetching Bitmex markets')

  // TODO: Implement proper request
  const rawMarkets = await http.publicRequest<IBitmexMarketSchema[]>({
    url: getBitmexEndpoints(settings).market.list,
  })

  const { requestWeight } = http

  return {
    rawMarkets,
    requestWeight,
  }

}
