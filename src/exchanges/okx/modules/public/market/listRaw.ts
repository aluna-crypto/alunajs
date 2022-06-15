import debug from 'debug'

import { IAlunaExchangePublic } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaMarketListParams,
  IAlunaMarketListRawReturns,
} from '../../../../../lib/modules/public/IAlunaMarketModule'
import { OkxSymbolTypeEnum } from '../../../enums/OkxSymbolTypeEnum'
import { OkxHttp } from '../../../OkxHttp'
import { getOkxEndpoints } from '../../../okxSpecs'
import { IOkxMarketSchema, IOkxMarketsResponseSchema } from '../../../schemas/IOkxMarketSchema'



const log = debug('alunajs:okx/market/listRaw')



export const listRaw = (exchange: IAlunaExchangePublic) => async (
  params: IAlunaMarketListParams = {},
): Promise<IAlunaMarketListRawReturns<IOkxMarketsResponseSchema>> => {

  const { settings } = exchange

  const { http = new OkxHttp(settings) } = params

  log('fetching Okx markets')

  const type = OkxSymbolTypeEnum.SPOT

  const rawMarkets = await http.publicRequest<IOkxMarketSchema[]>({
    url: getOkxEndpoints(settings).market.list(type),
  })

  const { rawSymbols } = await exchange.symbol.listRaw({
    http,
  })

  const { requestWeight } = http

  const rawMarketsResponse: IOkxMarketsResponseSchema = {
    rawMarkets,
    rawSymbols,
  }

  return {
    rawMarkets: rawMarketsResponse,
    requestWeight,
  }

}
