import debug from 'debug'

import { IAlunaExchangePublic } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaSymbolListParams,
  IAlunaSymbolListRawReturns,
} from '../../../../../lib/modules/public/IAlunaSymbolModule'
import { GateHttp } from '../../../GateHttp'
import { getGateEndpoints } from '../../../gateSpecs'
import { IGateSymbolSchema } from '../../../schemas/IGateSymbolSchema'



const log = debug('@alunajs:gate/symbol/listRaw')



export const listRaw = (exchange: IAlunaExchangePublic) => async (
  params: IAlunaSymbolListParams = {},
): Promise<IAlunaSymbolListRawReturns<IGateSymbolSchema[]>> => {

  log('fetching Gate raw symbols')

  const { settings } = exchange

  const { http = new GateHttp(settings) } = params

  const rawSymbols = await http.publicRequest<IGateSymbolSchema[]>({
    url: getGateEndpoints(settings).symbol.list,
  })

  const { requestCount } = http

  return {
    requestCount,
    rawSymbols,
  }

}
