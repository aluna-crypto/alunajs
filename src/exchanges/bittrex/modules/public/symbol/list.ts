import debug from 'debug'

import {
  IAlunaSymbolListParams,
  IAlunaSymbolListReturns,
} from '../../../../../lib/modules/public/IAlunaSymbolModule'
import { BittrexHttp } from '../../../BittrexHttp'
import { listRaw } from './listRaw'
import { parseMany } from './parseMany'



const log = debug('@aluna.js:bittrex/symbol/list')



export async function list (
  params: IAlunaSymbolListParams = {},
): Promise<IAlunaSymbolListReturns> {

  log('listing Bittrex symbols')

  const { http = new BittrexHttp() } = params
  const { requestCount } = http

  const { rawSymbols } = await listRaw({ http })
  const { symbols } = parseMany({ rawSymbols })

  return {
    symbols,
    requestCount,
  }

}
