import debug from 'debug'
import { filter } from 'lodash'

import { IAlunaExchangePublic } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaMarketListParams,
  IAlunaMarketListRawReturns,
} from '../../../../../lib/modules/public/IAlunaMarketModule'
import { FtxMarketTypeEnum } from '../../../enums/FtxMarketTypeEnum'
import { FtxHttp } from '../../../FtxHttp'
import { getFtxEndpoints } from '../../../ftxSpecs'
import { IFtxMarketSchema } from '../../../schemas/IFtxMarketSchema'



const log = debug('@alunajs:ftx/market/listRaw')



export const listRaw = (exchange: IAlunaExchangePublic) => async (
  params: IAlunaMarketListParams = {},
): Promise<IAlunaMarketListRawReturns<IFtxMarketSchema[]>> => {

  const { settings } = exchange

  const { http = new FtxHttp(settings) } = params

  log('fetching Ftx markets')

  const rawMarkets = await http.publicRequest<IFtxMarketSchema[]>({
    url: getFtxEndpoints(settings).market.list,
  })

  const filteredSpotMarkets = filter(
    rawMarkets,
    {
      type: FtxMarketTypeEnum.SPOT,
    },
  )

  const { requestWeight } = http

  return {
    rawMarkets: filteredSpotMarkets,
    requestWeight,
  }

}
