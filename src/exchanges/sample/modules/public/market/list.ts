import debug from 'debug'

import { IAlunaExchangePublic } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaMarketListParams,
  IAlunaMarketListReturns,
} from '../../../../../lib/modules/public/IAlunaMarketModule'
import { SampleHttp } from '../../../SampleHttp'



const log = debug('alunajs:sample/market/list')


export const list = (exchange: IAlunaExchangePublic) => async (
  params: IAlunaMarketListParams = {},
): Promise<IAlunaMarketListReturns> => {

  log('listing Sample markets')

  const { http = new SampleHttp(exchange.settings) } = params

  const { requestWeight } = http

  const { rawMarkets } = await exchange.market.listRaw({ http })

  const { markets } = exchange.market.parseMany({ rawMarkets })

  return {
    markets,
    requestWeight,
  }

}
