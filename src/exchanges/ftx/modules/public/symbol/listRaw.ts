import debug from 'debug'
import { filter } from 'lodash'

import { IAlunaExchangePublic } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaSymbolListParams,
  IAlunaSymbolListRawReturns,
} from '../../../../../lib/modules/public/IAlunaSymbolModule'
import { FtxMarketTypeEnum } from '../../../enums/FtxMarketTypeEnum'
import { FtxHttp } from '../../../FtxHttp'
import { getFtxEndpoints } from '../../../ftxSpecs'
import { IFtxMarketSchema } from '../../../schemas/IFtxMarketSchema'



const log = debug('@alunajs:ftx/symbol/listRaw')



export const listRaw = (exchange: IAlunaExchangePublic) => async (
  params: IAlunaSymbolListParams = {},
): Promise<IAlunaSymbolListRawReturns<IFtxMarketSchema[]>> => {

  log('fetching Ftx raw symbols')

  const { settings } = exchange

  const { http = new FtxHttp(settings) } = params

  const rawSymbols = await http.publicRequest<IFtxMarketSchema[]>({
    url: getFtxEndpoints(settings).symbol.list,
  })

  const filteredSpotSymbols = filter(
    rawSymbols,
    {
      type: FtxMarketTypeEnum.SPOT,
    },
  )

  const { requestWeight } = http

  return {
    rawSymbols: filteredSpotSymbols,
    requestWeight,
  }

}
