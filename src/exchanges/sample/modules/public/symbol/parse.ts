import debug from 'debug'

import { IAlunaExchangePublic } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaSymbolParseParams,
  IAlunaSymbolParseReturns,
} from '../../../../../lib/modules/public/IAlunaSymbolModule'
import { ISampleSymbolSchema } from '../../../schemas/ISampleSymbolSchema'



const log = debug('@aluna.js:sample/symbol/parse')


export const parse = (exchange: IAlunaExchangePublic) => (
  params: IAlunaSymbolParseParams<ISampleSymbolSchema>,
): IAlunaSymbolParseReturns => {

  log('params', params)

  return {} as any

}
