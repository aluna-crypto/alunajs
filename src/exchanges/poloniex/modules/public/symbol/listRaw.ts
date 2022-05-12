import debug from 'debug'

import { IAlunaExchangePublic } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaSymbolListParams,
  IAlunaSymbolListRawReturns,
} from '../../../../../lib/modules/public/IAlunaSymbolModule'
import { PoloniexHttp } from '../../../PoloniexHttp'
import { getPoloniexEndpoints } from '../../../poloniexSpecs'
import { IPoloniexSymbolSchema } from '../../../schemas/IPoloniexSymbolSchema'



const log = debug('@alunajs:poloniex/symbol/listRaw')



export const listRaw = (exchange: IAlunaExchangePublic) => async (
  params: IAlunaSymbolListParams = {},
): Promise<IAlunaSymbolListRawReturns<IPoloniexSymbolSchema[]>> => {

  log('fetching Poloniex raw symbols')

  const { settings } = exchange

  const { http = new PoloniexHttp(settings) } = params

  // TODO: Implement proper request
  const rawSymbols = await http.publicRequest<IPoloniexSymbolSchema[]>({
    url: getPoloniexEndpoints(settings).symbol.list,
  })

  const { requestWeight } = http

  return {
    requestWeight,
    rawSymbols,
  }

}
