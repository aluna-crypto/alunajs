import debug from 'debug'

import { IAlunaExchangePublic } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaMarketGetParams,
  IAlunaMarketGetRawReturns,
} from '../../../../../lib/modules/public/IAlunaMarketModule'
import { BitmexHttp } from '../../../BitmexHttp'
import { getBitmexEndpoints } from '../../../bitmexSpecs'
import { IBitmexMarketSchema } from '../../../schemas/IBitmexMarketSchema'



const log = debug('alunajs:bitmex/market/listRaw')



export const getRaw = (exchange: IAlunaExchangePublic) => async (
  params: IAlunaMarketGetParams,
): Promise<IAlunaMarketGetRawReturns<IBitmexMarketSchema>> => {

  const { settings } = exchange

  const {
    symbolPair,
    http = new BitmexHttp(settings),
  } = params

  log('fetching Bitmex markets')

  const [rawMarket] = await http.publicRequest<IBitmexMarketSchema[]>({
    url: getBitmexEndpoints(settings).market.get(symbolPair),
  })

  const { requestWeight } = http

  return {
    rawMarket,
    requestWeight,
  }

}
