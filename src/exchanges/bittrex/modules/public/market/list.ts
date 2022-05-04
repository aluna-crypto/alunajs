import debug from 'debug'

import { IAlunaExchangePublic } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaMarketListParams,
  IAlunaMarketListReturns,
} from '../../../../../lib/modules/public/IAlunaMarketModule'
import { BittrexHttp } from '../../../BittrexHttp'



const log = debug('@alunajs:bittrex/market/list')


export const list = (exchange: IAlunaExchangePublic) => async (
  params: IAlunaMarketListParams = {},
): Promise<IAlunaMarketListReturns> => {

  log('listing Bittrex markets')

  const { http = new BittrexHttp() } = params
  const { requestCount } = http

  const { rawMarkets } = await exchange.market.listRaw({ http })
  const { markets } = exchange.market.parseMany({ rawMarkets })

  return {
    markets,
    requestCount,
  }

}
