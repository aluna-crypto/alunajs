import {
  IAlunaSymbolListParams,
  IAlunaSymbolListReturns,
} from '../../../../../lib/modules/public/IAlunaSymbolModule'
import { BittrexHttp } from '../../../BittrexHttp'
import { listRaw } from './listRaw'
import { parseMany } from './parseMany'



export async function list (
  params: IAlunaSymbolListParams = {},
): Promise<IAlunaSymbolListReturns> {

  const {
    http = new BittrexHttp(),
  } = params

  const { rawSymbols } = await listRaw({ http })

  const { symbols } = await parseMany({
    http,
    rawSymbols,
  })

  const { requestCount } = http

  return {
    symbols,
    requestCount,
  }

}
