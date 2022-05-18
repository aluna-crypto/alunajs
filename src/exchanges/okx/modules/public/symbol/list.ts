import debug from 'debug'

import { IAlunaExchangePublic } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaSymbolListParams,
  IAlunaSymbolListReturns,
} from '../../../../../lib/modules/public/IAlunaSymbolModule'
import { OkxHttp } from '../../../OkxHttp'



const log = debug('alunajs:okx/symbol/list')



export const list = (exchange: IAlunaExchangePublic) => async (
  params: IAlunaSymbolListParams = {},
): Promise<IAlunaSymbolListReturns> => {

  log('listing Okx symbols')

  const { http = new OkxHttp(exchange.settings) } = params

  const { requestWeight } = http

  const { rawSymbols } = await exchange.symbol.listRaw({ http })

  const { symbols } = exchange.symbol.parseMany({ rawSymbols })

  return {
    symbols,
    requestWeight,
  }

}
