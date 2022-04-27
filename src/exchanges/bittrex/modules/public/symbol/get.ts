import debug from 'debug'

import { IAlunaExchangePublic } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaSymbolGetParams,
  IAlunaSymbolGetReturns,
} from '../../../../../lib/modules/public/IAlunaSymbolModule'



const log = debug('@aluna.js:bittrex/symbol/get')



export const get = (exchange: IAlunaExchangePublic) => async (
  params: IAlunaSymbolGetParams,
): Promise<IAlunaSymbolGetReturns> => {

  log('params', params)

  return params as any

}
