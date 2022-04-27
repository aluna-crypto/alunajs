import debug from 'debug'

import { IAlunaExchangePublic } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaMarketParseParams,
  IAlunaMarketParseReturns,
} from '../../../../../lib/modules/public/IAlunaMarketModule'
import { ISampleMarketSchema } from '../../../schemas/ISampleMarketSchema'



const log = debug('@aluna.js:sample/market/parse')



export const parse = (exchange: IAlunaExchangePublic) => (
  params: IAlunaMarketParseParams<ISampleMarketSchema>,
): IAlunaMarketParseReturns => {

  log('params', params)

  return {} as any

}
