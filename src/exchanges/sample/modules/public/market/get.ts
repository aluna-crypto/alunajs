import debug from 'debug'

import { IAlunaExchangePublic } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaMarketGetParams,
  IAlunaMarketGetReturns,
} from '../../../../../lib/modules/public/IAlunaMarketModule'



const log = debug('@aluna.js:sample/market/get')



export const get = (_exchange: IAlunaExchangePublic) => async (
  params: IAlunaMarketGetParams,
): Promise<IAlunaMarketGetReturns> => {

  log('params', params)

  return {} as any

}
