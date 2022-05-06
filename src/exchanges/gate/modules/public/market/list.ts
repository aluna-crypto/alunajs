import debug from 'debug'

import { IAlunaExchangePublic } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaMarketListParams,
  IAlunaMarketListReturns,
} from '../../../../../lib/modules/public/IAlunaMarketModule'
import { GateHttp } from '../../../GateHttp'



const log = debug('@alunajs:gate/market/list')


export const list = (exchange: IAlunaExchangePublic) => async (
  params: IAlunaMarketListParams = {},
): Promise<IAlunaMarketListReturns> => {

  log('listing Gate markets')

  const { http = new GateHttp() } = params

  const { requestCount } = http

  const { rawMarkets } = await exchange.market.listRaw({ http })

  const { markets } = exchange.market.parseMany({ rawMarkets })

  return {
    markets,
    requestCount,
  }

}
