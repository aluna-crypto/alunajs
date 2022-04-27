import debug from 'debug'

import { IAlunaExchangePublic } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaSymbolGetParams,
  IAlunaSymbolGetRawReturns,
} from '../../../../../lib/modules/public/IAlunaSymbolModule'
import { IBittrexSymbolSchema } from '../../../schemas/IBittrexSymbolSchema'



const log = debug('@aluna.js:bittrex/symbol/getRaw')



export const getRaw = (exchange: IAlunaExchangePublic) => async (
  params: IAlunaSymbolGetParams,
): Promise<IAlunaSymbolGetRawReturns<IBittrexSymbolSchema>> => {

  log('params', params)

  return params as any

}
