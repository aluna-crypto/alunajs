import debug from 'debug'

import { IAlunaExchangePublic } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaSymbolListParams,
  IAlunaSymbolListReturns,
} from '../../../../../lib/modules/public/IAlunaSymbolModule'
import { BittrexHttp } from '../../../BittrexHttp'



const log = debug('@aluna.js:bittrex/symbol/list')



export const list = (exchange: IAlunaExchangePublic) => async (
  params: IAlunaSymbolListParams = {},
): Promise<IAlunaSymbolListReturns> => {

  log('listing Bittrex symbols')

  const { http = new BittrexHttp() } = params
  const { requestCount } = http

  const { rawSymbols } = await exchange.symbol.listRaw({ http })
  const { symbols } = exchange.symbol.parseMany({ rawSymbols })

  return {
    symbols,
    requestCount,
  }

}
