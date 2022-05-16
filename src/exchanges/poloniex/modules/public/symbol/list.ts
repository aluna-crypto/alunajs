import debug from 'debug'

import { IAlunaExchangePublic } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaSymbolListParams,
  IAlunaSymbolListReturns,
} from '../../../../../lib/modules/public/IAlunaSymbolModule'
import { PoloniexHttp } from '../../../PoloniexHttp'



const log = debug('@alunajs:poloniex/symbol/list')



export const list = (exchange: IAlunaExchangePublic) => async (
  params: IAlunaSymbolListParams = {},
): Promise<IAlunaSymbolListReturns> => {

  log('listing Poloniex symbols')

  const { http = new PoloniexHttp(exchange.settings) } = params

  const { requestWeight } = http

  const { rawSymbols } = await exchange.symbol.listRaw({ http })

  const { symbols } = exchange.symbol.parseMany({ rawSymbols })

  return {
    symbols,
    requestWeight,
  }

}
