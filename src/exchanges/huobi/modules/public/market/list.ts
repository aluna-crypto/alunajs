import debug from 'debug'

import { IAlunaExchangePublic } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaMarketListParams,
  IAlunaMarketListReturns,
} from '../../../../../lib/modules/public/IAlunaMarketModule'
import { HuobiHttp } from '../../../HuobiHttp'



const log = debug('alunajs:huobi/market/list')


export const list = (exchange: IAlunaExchangePublic) => async (
  params: IAlunaMarketListParams = {},
): Promise<IAlunaMarketListReturns> => {

  log('listing Huobi markets')

  const { http = new HuobiHttp(exchange.settings) } = params

  const { requestWeight } = http

  const { rawMarkets } = await exchange.market.listRaw({ http })

  const { markets } = exchange.market.parseMany({ rawMarkets })

  return {
    markets,
    requestWeight,
  }

}
