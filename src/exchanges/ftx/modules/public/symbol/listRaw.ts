import debug from 'debug'

import { IAlunaExchangePublic } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaSymbolListParams,
  IAlunaSymbolListRawReturns,
} from '../../../../../lib/modules/public/IAlunaSymbolModule'
import { FtxHttp } from '../../../FtxHttp'
import { getFtxEndpoints } from '../../../ftxSpecs'
import { IFtxSymbolSchema } from '../../../schemas/IFtxSymbolSchema'



const log = debug('@alunajs:ftx/symbol/listRaw')



export const listRaw = (exchange: IAlunaExchangePublic) => async (
  params: IAlunaSymbolListParams = {},
): Promise<IAlunaSymbolListRawReturns<IFtxSymbolSchema[]>> => {

  log('fetching Ftx raw symbols')

  const { settings } = exchange

  const { http = new FtxHttp(settings) } = params

  // TODO: Implement proper request
  const rawSymbols = await http.publicRequest<IFtxSymbolSchema[]>({
    url: getFtxEndpoints(settings).symbol.list,
  })

  const { requestWeight } = http

  return {
    requestWeight,
    rawSymbols,
  }

}
