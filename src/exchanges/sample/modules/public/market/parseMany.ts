import debug from 'debug'

import { IAlunaExchangePublic } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaMarketParseManyParams,
  IAlunaMarketParseManyReturns,
} from '../../../../../lib/modules/public/IAlunaMarketModule'
import { ISampleMarketSchema } from '../../../schemas/ISampleMarketSchema'



const log = debug('@aluna.js:sample/market/parseMany')



export const parseMany = (_exchange: IAlunaExchangePublic) => (
  params: IAlunaMarketParseManyParams<ISampleMarketSchema[]>,
): IAlunaMarketParseManyReturns => {

  log('params', params)

  return {} as any

}
