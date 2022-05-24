import debug from 'debug'

import { IAlunaExchangePublic } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaMarketListParams,
  IAlunaMarketListRawReturns,
} from '../../../../../lib/modules/public/IAlunaMarketModule'
import { HuobiHttp } from '../../../HuobiHttp'
import { getHuobiEndpoints } from '../../../huobiSpecs'
import { IHuobiMarketsSchema, IHuobiMarketTickerSchema } from '../../../schemas/IHuobiMarketSchema'



const log = debug('alunajs:huobi/market/listRaw')



export const listRaw = (exchange: IAlunaExchangePublic) => async (
  params: IAlunaMarketListParams = {},
): Promise<IAlunaMarketListRawReturns<IHuobiMarketsSchema>> => {

  const { settings } = exchange

  const { http = new HuobiHttp(settings) } = params

  log('fetching Huobi markets')

  const rawMarketTickers = await http.publicRequest<IHuobiMarketTickerSchema[]>({
    url: getHuobiEndpoints(settings).market.list,
  })

  const { rawSymbols } = await exchange.symbol.listRaw({
    http,
  })

  const { requestWeight } = http

  const rawMarkets: IHuobiMarketsSchema = {
    rawMarkets: rawMarketTickers,
    rawSymbols,
  }

  return {
    rawMarkets,
    requestWeight,
  }

}
