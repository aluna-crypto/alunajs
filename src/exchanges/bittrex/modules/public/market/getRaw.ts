import { debug } from 'debug'

import {
  IAlunaMarketGetParams,
  IAlunaMarketGetRawReturns,
} from '../../../../../lib/modules/public/IAlunaMarketModule'
import { IBittrexMarketSchema } from '../../../schemas/IBittrexMarketSchema'



const log = debug('@aluna.js:bittrex/market/getRaw')



export async function getRaw (
  params: IAlunaMarketGetParams,
): Promise<IAlunaMarketGetRawReturns<IBittrexMarketSchema>> {

  log('params', params)

  return params as any

}
