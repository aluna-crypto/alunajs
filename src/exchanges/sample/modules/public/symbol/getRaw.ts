import debug from 'debug'

import { IAlunaExchangePublic } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaSymbolGetParams,
  IAlunaSymbolGetRawReturns,
} from '../../../../../lib/modules/public/IAlunaSymbolModule'
import { ISampleSymbolSchema } from '../../../schemas/ISampleSymbolSchema'



const log = debug('@aluna.js:sample/symbol/getRaw')


export const getRaw = (exchange: IAlunaExchangePublic) => async (
  params: IAlunaSymbolGetParams,
): Promise<IAlunaSymbolGetRawReturns<ISampleSymbolSchema>> => {

  log('params', params)

  return {} as any

}
