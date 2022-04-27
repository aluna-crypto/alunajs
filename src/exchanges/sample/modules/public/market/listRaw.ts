import debug from 'debug'

import { IAlunaExchangePublic } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaMarketListParams,
  IAlunaMarketListRawReturns,
} from '../../../../../lib/modules/public/IAlunaMarketModule'
import { ISampleMarketSchema } from '../../../schemas/ISampleMarketSchema'



const log = debug('@aluna.js:sample/market/listRaw')



export const listRaw = (_exchange: IAlunaExchangePublic) => async (
  params: IAlunaMarketListParams = {},
): Promise<IAlunaMarketListRawReturns<ISampleMarketSchema[]>> => {

  log('params', params)

  return {} as any

}
