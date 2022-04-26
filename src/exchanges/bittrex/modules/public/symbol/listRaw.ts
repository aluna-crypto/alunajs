import debug from 'debug'

import {
  IAlunaSymbolListParams,
  IAlunaSymbolListRawReturns,
} from '../../../../../lib/modules/public/IAlunaSymbolModule'
import { BittrexHttp } from '../../../BittrexHttp'
import { BITTREX_PRODUCTION_URL } from '../../../bittrexSpecs'
import { IBittrexSymbolSchema } from '../../../schemas/IBittrexSymbolSchema'



const log = debug('@aluna.js:bittrex/symbol/listRaw')


export async function listRaw (
  params: IAlunaSymbolListParams = {},
): Promise<IAlunaSymbolListRawReturns> {

  log('fetching Bittrex symbols')

  const {
    http = new BittrexHttp(),
  } = params

  const rawSymbols = await http.publicRequest<IBittrexSymbolSchema[]>({
    url: `${BITTREX_PRODUCTION_URL}/currencies`,
  })

  const { requestCount } = http

  return {
    requestCount,
    rawSymbols,
  }

}
