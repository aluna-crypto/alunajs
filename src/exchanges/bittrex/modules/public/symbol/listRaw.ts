import debug from 'debug'

import { IAlunaExchangePublic } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaSymbolListParams,
  IAlunaSymbolListRawReturns,
} from '../../../../../lib/modules/public/IAlunaSymbolModule'
import { BittrexHttp } from '../../../BittrexHttp'
import { getBittrexEndpoints } from '../../../bittrexSpecs'
import { IBittrexSymbolSchema } from '../../../schemas/IBittrexSymbolSchema'



const log = debug('@alunajs:bittrex/symbol/listRaw')



export const listRaw = (exchange: IAlunaExchangePublic) => async (
  params: IAlunaSymbolListParams = {},
): Promise<IAlunaSymbolListRawReturns<IBittrexSymbolSchema[]>> => {

  log('fetching Bittrex raw symbols')

  const { settings } = exchange

  const { http = new BittrexHttp(settings) } = params

  const rawSymbols = await http.publicRequest<IBittrexSymbolSchema[]>({
    url: getBittrexEndpoints(settings).symbol.list,
  })

  const { requestCount } = http

  return {
    requestCount,
    rawSymbols,
  }

}
