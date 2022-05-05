import debug from 'debug'

import { IAlunaExchangePublic } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaSymbolListParams,
  IAlunaSymbolListRawReturns,
} from '../../../../../lib/modules/public/IAlunaSymbolModule'
import { BitfinexHttp } from '../../../BitfinexHttp'
import { bitfinexEndpoints } from '../../../bitfinexSpecs'
import { IBitfinexSymbolSchema } from '../../../schemas/IBitfinexSymbolSchema'



const log = debug('@alunajs:bitfinex/symbol/listRaw')



export const listRaw = (exchange: IAlunaExchangePublic) => async (
  params: IAlunaSymbolListParams = {},
): Promise<IAlunaSymbolListRawReturns<IBitfinexSymbolSchema[]>> => {

  log('fetching Bitfinex raw symbols')

  const { http = new BitfinexHttp() } = params

  // TODO: Implement proper request
  const rawSymbols = await http.publicRequest<IBitfinexSymbolSchema[]>({
    url: bitfinexEndpoints.symbol.list,
  })

  const { requestCount } = http

  return {
    requestCount,
    rawSymbols,
  }

}
