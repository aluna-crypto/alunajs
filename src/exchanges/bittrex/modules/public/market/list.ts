import debug from 'debug'

import {
  IAlunaMarketListParams,
  IAlunaMarketListReturns,
} from '../../../../../lib/modules/public/IAlunaMarketModule'
import { BittrexHttp } from '../../../BittrexHttp'
import { listRaw } from './listRaw'
import { parseMany } from './parseMany'



const log = debug('@aluna.js:bittrex/market/list')



export async function list (
  params: IAlunaMarketListParams = {},
): Promise<IAlunaMarketListReturns> {

  log('listing Bittrex markets')

  const { http = new BittrexHttp() } = params
  const { requestCount } = http

  const { rawMarkets } = await listRaw({ http })
  const { markets } = parseMany({ rawMarkets })

  return {
    markets,
    requestCount,
  }

}
