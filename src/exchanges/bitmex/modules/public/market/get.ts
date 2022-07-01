import debug from 'debug'

import { IAlunaExchangePublic } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaMarketGetParams,
  IAlunaMarketGetReturns,
} from '../../../../../lib/modules/public/IAlunaMarketModule'
import { BitmexHttp } from '../../../BitmexHttp'



const log = debug('alunajs:bitmex/market/list')



export const get = (exchange: IAlunaExchangePublic) => async (
  params: IAlunaMarketGetParams,
): Promise<IAlunaMarketGetReturns> => {

  log('listing Bitmex symbols')

  const { symbolPair } = params

  const { http = new BitmexHttp(exchange.settings) } = params

  const { requestWeight } = http

  const { rawMarket } = await exchange.market.getRaw!({
    http,
    symbolPair,
  })

  const { market } = exchange.market.parse({ rawMarket })

  return {
    market,
    requestWeight,
  }

}
