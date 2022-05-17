import debug from 'debug'

import { IAlunaExchangePublic } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaSymbolListParams,
  IAlunaSymbolListRawReturns,
} from '../../../../../lib/modules/public/IAlunaSymbolModule'
import { PoloniexHttp } from '../../../PoloniexHttp'
import { getPoloniexEndpoints } from '../../../poloniexSpecs'
import { IPoloniexSymbolResponseSchema } from '../../../schemas/IPoloniexSymbolSchema'



const log = debug('alunajs:poloniex/symbol/listRaw')



export const listRaw = (exchange: IAlunaExchangePublic) => async (
  params: IAlunaSymbolListParams = {},
): Promise<IAlunaSymbolListRawReturns<IPoloniexSymbolResponseSchema>> => {

  log('fetching Poloniex raw symbols')

  const { settings } = exchange

  const { http = new PoloniexHttp(settings) } = params

  const query = new URLSearchParams()

  query.append('command', 'returnCurrencies')

  const rawSymbols = await http.publicRequest<IPoloniexSymbolResponseSchema>({
    url: getPoloniexEndpoints(settings).symbol.list(query.toString()),
  })

  const { requestWeight } = http

  return {
    rawSymbols,
    requestWeight,
  }

}
