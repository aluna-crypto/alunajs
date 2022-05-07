import debug from 'debug'

import { IAlunaExchangePublic } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaMarketListParams,
  IAlunaMarketListReturns,
} from '../../../../../lib/modules/public/IAlunaMarketModule'
import { ValrHttp } from '../../../ValrHttp'



const log = debug('@alunajs:valr/market/list')


export const list = (exchange: IAlunaExchangePublic) => async (
  params: IAlunaMarketListParams = {},
): Promise<IAlunaMarketListReturns> => {

  log('listing Valr markets')

  const { http = new ValrHttp(exchange.settings) } = params

  const { requestCount } = http

  const { rawMarkets } = await exchange.market.listRaw({ http })

  const { markets } = exchange.market.parseMany({ rawMarkets })

  return {
    markets,
    requestCount,
  }

}
