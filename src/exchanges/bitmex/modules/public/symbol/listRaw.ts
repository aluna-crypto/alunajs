import debug from 'debug'

import { IAlunaExchangePublic } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaSymbolListParams,
  IAlunaSymbolListRawReturns,
} from '../../../../../lib/modules/public/IAlunaSymbolModule'
import { BitmexHttp } from '../../../BitmexHttp'
import { getBitmexEndpoints } from '../../../bitmexSpecs'
import { IBitmexSymbolSchema } from '../../../schemas/IBitmexSymbolSchema'



const log = debug('@alunajs:bitmex/symbol/listRaw')



export const listRaw = (exchange: IAlunaExchangePublic) => async (
  params: IAlunaSymbolListParams = {},
): Promise<IAlunaSymbolListRawReturns<IBitmexSymbolSchema[]>> => {

  log('fetching Bitmex raw symbols')

  const { settings } = exchange

  const { http = new BitmexHttp(settings) } = params

  const rawSymbols = await http.publicRequest<IBitmexSymbolSchema[]>({
    url: getBitmexEndpoints(settings).symbol.list,
  })

  const { requestWeight } = http

  return {
    requestWeight,
    rawSymbols,
  }

}
