import debug from 'debug'

import { IAlunaExchangePublic } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaMarketListParams,
  IAlunaMarketListReturns,
} from '../../../../../lib/modules/public/IAlunaMarketModule'
import { PoloniexHttp } from '../../../PoloniexHttp'



const log = debug('@alunajs:poloniex/market/list')


export const list = (exchange: IAlunaExchangePublic) => async (
  params: IAlunaMarketListParams = {},
): Promise<IAlunaMarketListReturns> => {

  log('listing Poloniex markets')

  const { http = new PoloniexHttp(exchange.settings) } = params

  const { requestWeight } = http

  const { rawMarkets } = await exchange.market.listRaw({ http })

  const { markets } = exchange.market.parseMany({ rawMarkets })

  return {
    markets,
    requestWeight,
  }

}
