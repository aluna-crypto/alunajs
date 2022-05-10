import debug from 'debug'

import { IAlunaExchangePublic } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaSymbolListParams,
  IAlunaSymbolListRawReturns,
} from '../../../../../lib/modules/public/IAlunaSymbolModule'
import { binanceHttp } from '../../../binanceHttp'
import { getbinanceEndpoints } from '../../../binanceSpecs'
import { IbinanceSymbolSchema } from '../../../schemas/IbinanceSymbolSchema'



const log = debug('@alunajs:binance/symbol/listRaw')



export const listRaw = (exchange: IAlunaExchangePublic) => async (
  params: IAlunaSymbolListParams = {},
): Promise<IAlunaSymbolListRawReturns<IbinanceSymbolSchema[]>> => {

  log('fetching binance raw symbols')

  const { settings } = exchange

  const { http = new binanceHttp(settings) } = params

  // TODO: Implement proper request
  const rawSymbols = await http.publicRequest<IbinanceSymbolSchema[]>({
    url: getbinanceEndpoints(settings).symbol.list,
  })

  const { requestCount } = http

  return {
    requestCount,
    rawSymbols,
  }

}
