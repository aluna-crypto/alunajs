import { debug } from 'debug'

import {
  IAlunaMarketGetParams,
  IAlunaMarketGetReturns,
} from '../../../../../lib/modules/public/IAlunaMarketModule'
import { BittrexHttp } from '../../../BittrexHttp'



const log = debug('@aluna.js:bittrex/market/get')



export async function get (
  params: IAlunaMarketGetParams,
): Promise<IAlunaMarketGetReturns> {

  const {
    id,
    http = new BittrexHttp(),
  } = params

  const { requestCount } = http

  log({ id, requestCount })

  return params as any

}
