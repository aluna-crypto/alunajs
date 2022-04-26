import {
  IAlunaMarketListParams,
  IAlunaMarketListReturns,
} from '../../../../../lib/modules/public/IAlunaMarketModule'
import { BittrexHttp } from '../../../BittrexHttp'
import { listRaw } from './listRaw'
import { parseMany } from './parseMany'



export async function list (
  params: IAlunaMarketListParams = {},
): Promise<IAlunaMarketListReturns> {

  const {
    http = new BittrexHttp(),
  } = params

  const { rawMarkets } = await listRaw({ http })

  const {
    markets,
    requestCount,
  } = await parseMany({
    http,
    rawMarkets,
  })

  return {
    markets,
    requestCount,
  }

}
