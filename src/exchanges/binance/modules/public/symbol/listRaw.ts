import debug from 'debug'

import { IAlunaExchangePublic } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaSymbolListParams,
  IAlunaSymbolListRawReturns,
} from '../../../../../lib/modules/public/IAlunaSymbolModule'
import { BinanceHttp } from '../../../BinanceHttp'
import { getBinanceEndpoints } from '../../../binanceSpecs'
import {
  IBinanceSymbolListResponseSchema,
  IBinanceSymbolSchema,
} from '../../../schemas/IBinanceSymbolSchema'



const log = debug('@alunajs:binance/symbol/listRaw')



export const listRaw = (exchange: IAlunaExchangePublic) => async (
  params: IAlunaSymbolListParams = {},
): Promise<IAlunaSymbolListRawReturns<IBinanceSymbolSchema[]>> => {

  log('fetching Binance raw symbols')

  const { settings } = exchange

  const { http = new BinanceHttp(settings) } = params

  const { symbols } = await http.publicRequest<IBinanceSymbolListResponseSchema>({
    url: getBinanceEndpoints(settings).symbol.list,
  })

  const { requestWeight } = http

  return {
    rawSymbols: symbols,
    requestWeight,
  }

}
