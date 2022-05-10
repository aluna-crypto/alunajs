import debug from 'debug'

import { IAlunaExchangePublic } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaSymbolListParams,
  IAlunaSymbolListRawReturns,
} from '../../../../../lib/modules/public/IAlunaSymbolModule'
import { BinanceHttp } from '../../../BinanceHttp'
import { getBinanceEndpoints } from '../../../binanceSpecs'
import { IBinanceSymbolSchema } from '../../../schemas/IBinanceSymbolSchema'



const log = debug('@alunajs:binance/symbol/listRaw')



export const listRaw = (exchange: IAlunaExchangePublic) => async (
  params: IAlunaSymbolListParams = {},
): Promise<IAlunaSymbolListRawReturns<IBinanceSymbolSchema[]>> => {

  log('fetching Binance raw symbols')

  const { settings } = exchange

  const { http = new BinanceHttp(settings) } = params

  // TODO: Implement proper request
  const rawSymbols = await http.publicRequest<IBinanceSymbolSchema[]>({
    url: getBinanceEndpoints(settings).symbol.list,
  })

  const { requestCount } = http

  return {
    requestCount,
    rawSymbols,
  }

}
