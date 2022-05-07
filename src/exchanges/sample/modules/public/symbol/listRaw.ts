import debug from 'debug'

import { IAlunaExchangePublic } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaSymbolListParams,
  IAlunaSymbolListRawReturns,
} from '../../../../../lib/modules/public/IAlunaSymbolModule'
import { SampleHttp } from '../../../SampleHttp'
import { sampleEndpoints } from '../../../sampleSpecs'
import { ISampleSymbolSchema } from '../../../schemas/ISampleSymbolSchema'



const log = debug('@alunajs:sample/symbol/listRaw')



export const listRaw = (exchange: IAlunaExchangePublic) => async (
  params: IAlunaSymbolListParams = {},
): Promise<IAlunaSymbolListRawReturns<ISampleSymbolSchema[]>> => {

  log('fetching Sample raw symbols')

  const { http = new SampleHttp(exchange.settings) } = params

  // TODO: Implement proper request
  const rawSymbols = await http.publicRequest<ISampleSymbolSchema[]>({
    url: sampleEndpoints.symbol.list,
  })

  const { requestCount } = http

  return {
    requestCount,
    rawSymbols,
  }

}
