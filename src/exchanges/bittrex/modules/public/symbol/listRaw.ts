import debug from 'debug'

import { IAlunaExchangePublic } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaSymbolListParams,
  IAlunaSymbolListRawReturns,
} from '../../../../../lib/modules/public/IAlunaSymbolModule'
import { BittrexHttp } from '../../../BittrexHttp'
import { BITTREX_PRODUCTION_URL } from '../../../bittrexSpecs'
import { IBittrexSymbolSchema } from '../../../schemas/IBittrexSymbolSchema'



const log = debug('@aluna.js:bittrex/symbol/listRaw')



export const listRaw = (exchange: IAlunaExchangePublic) => async (
  params: IAlunaSymbolListParams = {},
): Promise<IAlunaSymbolListRawReturns<IBittrexSymbolSchema[]>> => {

  log('fetching Bittrex raw symbols')

  const { http = new BittrexHttp() } = params

  const rawSymbols = await http.publicRequest<IBittrexSymbolSchema[]>({
    url: `${BITTREX_PRODUCTION_URL}/currencies`,
  })

  const { requestCount } = http

  return {
    requestCount,
    rawSymbols,
  }

}
