import debug from 'debug'

import { IAlunaExchangePublic } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaSymbolListParams,
  IAlunaSymbolListReturns,
} from '../../../../../lib/modules/public/IAlunaSymbolModule'
import { BitfinexHttp } from '../../../BitfinexHttp'



const log = debug('alunajs:bitfinex/symbol/list')



export const list = (exchange: IAlunaExchangePublic) => async (
  params: IAlunaSymbolListParams = {},
): Promise<IAlunaSymbolListReturns> => {

  log('listing Bitfinex symbols')

  const { http = new BitfinexHttp(exchange.settings) } = params

  const { requestWeight } = http

  const { rawSymbols } = await exchange.symbol.listRaw({ http })

  const { symbols } = exchange.symbol.parseMany({ rawSymbols })

  return {
    symbols,
    requestWeight,
  }

}
