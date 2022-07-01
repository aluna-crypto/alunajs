import debug from 'debug'

import { IAlunaExchangePublic } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaMarketGetParams,
  IAlunaMarketGetReturns,
} from '../../../../../lib/modules/public/IAlunaMarketModule'
import { HuobiHttp } from '../../../HuobiHttp'



const log = debug('alunajs:Huobi/market/list')



export const get = (exchange: IAlunaExchangePublic) => async (
  params: IAlunaMarketGetParams,
): Promise<IAlunaMarketGetReturns> => {

  log('listing Huobi symbols')

  const { symbolPair } = params

  const { http = new HuobiHttp(exchange.settings) } = params

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
