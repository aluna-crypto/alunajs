import { debug } from 'debug'

import {
  IAlunaMarketGetParams,
  IAlunaMarketGetReturns,
} from '../../../../../lib/modules/public/IAlunaMarketModule'
import { IAlunaMarketSchema } from '../../../../../lib/schemas/IAlunaMarketSchema'
import { BittrexHttp } from '../../../BittrexHttp'
import { BITTREX_PRODUCTION_URL } from '../../../bittrexSpecs'



const log = debug('@aluna.js:bittrex/market/get')



export async function get (
  params: IAlunaMarketGetParams,
): Promise<IAlunaMarketGetReturns> {

  log('params', params)

  const { http = new BittrexHttp() } = params

  const market = await http.publicRequest<IAlunaMarketSchema>({
    url: BITTREX_PRODUCTION_URL,
  })

  const { requestCount } = http

  return {
    market,
    requestCount,
  }

}
