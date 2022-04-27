import debug from 'debug'

import { IAlunaExchangePublic } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaSymbolListParams,
  IAlunaSymbolListRawReturns,
} from '../../../../../lib/modules/public/IAlunaSymbolModule'
import { ISampleSymbolSchema } from '../../../schemas/ISampleSymbolSchema'



const log = debug('@aluna.js:sample/symbol/listRaw')


export const listRaw = (_exchange: IAlunaExchangePublic) => async (
  params: IAlunaSymbolListParams = {},
): Promise<IAlunaSymbolListRawReturns<ISampleSymbolSchema[]>> => {

  log('params', params)

  return {} as any

}
