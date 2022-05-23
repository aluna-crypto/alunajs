import debug from 'debug'

import { IAlunaExchangePublic } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaSymbolListParams,
  IAlunaSymbolListRawReturns,
} from '../../../../../lib/modules/public/IAlunaSymbolModule'
import { HuobiHttp } from '../../../HuobiHttp'
import { getHuobiEndpoints } from '../../../huobiSpecs'
import { IHuobiSymbolSchema } from '../../../schemas/IHuobiSymbolSchema'



const log = debug('alunajs:huobi/symbol/listRaw')



export const listRaw = (exchange: IAlunaExchangePublic) => async (
  params: IAlunaSymbolListParams = {},
): Promise<IAlunaSymbolListRawReturns<IHuobiSymbolSchema[]>> => {

  log('fetching Huobi raw symbols')

  const { settings } = exchange

  const { http = new HuobiHttp(settings) } = params

  // TODO: Implement proper request
  const rawSymbols = await http.publicRequest<IHuobiSymbolSchema[]>({
    url: getHuobiEndpoints(settings).symbol.list,
  })

  const { requestWeight } = http

  return {
    requestWeight,
    rawSymbols,
  }

}
