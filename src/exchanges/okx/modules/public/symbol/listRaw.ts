import debug from 'debug'

import { IAlunaExchangePublic } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaSymbolListParams,
  IAlunaSymbolListRawReturns,
} from '../../../../../lib/modules/public/IAlunaSymbolModule'
import { OkxSymbolTypeEnum } from '../../../enums/OkxSymbolTypeEnum'
import { OkxHttp } from '../../../OkxHttp'
import { getOkxEndpoints } from '../../../okxSpecs'
import { IOkxSymbolSchema } from '../../../schemas/IOkxSymbolSchema'



const log = debug('alunajs:okx/symbol/listRaw')



export const listRaw = (exchange: IAlunaExchangePublic) => async (
  params: IAlunaSymbolListParams = {},
): Promise<IAlunaSymbolListRawReturns<IOkxSymbolSchema[]>> => {

  log('fetching Okx raw symbols')

  const { settings } = exchange

  const { http = new OkxHttp(settings) } = params

  const type = OkxSymbolTypeEnum.SPOT

  const rawSymbols = await http.publicRequest<IOkxSymbolSchema[]>({
    url: getOkxEndpoints(settings).symbol.list(type),
  })

  const { requestWeight } = http

  return {
    requestWeight,
    rawSymbols,
  }

}
