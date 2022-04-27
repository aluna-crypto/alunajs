import debug from 'debug'

import { IAlunaExchangePublic } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaMarketGetParams,
  IAlunaMarketGetRawReturns,
} from '../../../../../lib/modules/public/IAlunaMarketModule'
import { ISampleMarketSchema } from '../../../schemas/ISampleMarketSchema'



const log = debug('@aluna.js:sample/market/getRaw')



export const getRaw = (exchange: IAlunaExchangePublic) => async (
  params: IAlunaMarketGetParams,
): Promise<IAlunaMarketGetRawReturns<ISampleMarketSchema>> => {

  log('params', params)

  return {} as any

}
