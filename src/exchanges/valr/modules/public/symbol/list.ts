import debug from 'debug'

import { IAlunaExchangePublic } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaSymbolListParams,
  IAlunaSymbolListReturns,
} from '../../../../../lib/modules/public/IAlunaSymbolModule'
import { ValrHttp } from '../../../ValrHttp'



const log = debug('@alunajs:valr/symbol/list')



export const list = (exchange: IAlunaExchangePublic) => async (
  params: IAlunaSymbolListParams = {},
): Promise<IAlunaSymbolListReturns> => {

  log('listing Valr symbols')

  const { http = new ValrHttp(exchange.settings) } = params

  const { requestWeight } = http

  const { rawSymbols } = await exchange.symbol.listRaw({ http })

  const { symbols } = exchange.symbol.parseMany({ rawSymbols })

  return {
    symbols,
    requestWeight,
  }

}
