import debug from 'debug'

import { IAlunaExchangePublic } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaSymbolListParams,
  IAlunaSymbolListReturns,
} from '../../../../../lib/modules/public/IAlunaSymbolModule'
import { HuobiHttp } from '../../../HuobiHttp'



const log = debug('alunajs:huobi/symbol/list')



export const list = (exchange: IAlunaExchangePublic) => async (
  params: IAlunaSymbolListParams = {},
): Promise<IAlunaSymbolListReturns> => {

  log('listing Huobi symbols')

  const { http = new HuobiHttp(exchange.settings) } = params

  const { requestWeight } = http

  const { rawSymbols } = await exchange.symbol.listRaw({ http })

  const { symbols } = exchange.symbol.parseMany({ rawSymbols })

  return {
    symbols,
    requestWeight,
  }

}
