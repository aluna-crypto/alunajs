import debug from 'debug'

import { IAlunaExchangePublic } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaSymbolListParams,
  IAlunaSymbolListRawReturns,
} from '../../../../../lib/modules/public/IAlunaSymbolModule'
import { BittrexHttp } from '../../../BittrexHttp'
import { bittrexEndpoints } from '../../../bittrexSpecs'
import { IBittrexSymbolSchema } from '../../../schemas/IBittrexSymbolSchema'



const log = debug('@aluna.js:bittrex/symbol/listRaw')



export const listRaw = (exchange: IAlunaExchangePublic) => async (
  params: IAlunaSymbolListParams = {},
): Promise<IAlunaSymbolListRawReturns<IBittrexSymbolSchema[]>> => {

  log('fetching Bittrex raw symbols')

  const { http = new BittrexHttp() } = params

  const rawSymbols = await http.publicRequest<IBittrexSymbolSchema[]>({
    url: bittrexEndpoints.symbol.list,
  })

  const { requestCount } = http

  return {
    requestCount,
    rawSymbols,
  }

}
