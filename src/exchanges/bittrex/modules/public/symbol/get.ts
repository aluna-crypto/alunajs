import debug from 'debug'

import {
  IAlunaSymbolGetParams,
  IAlunaSymbolGetReturns,
} from '../../../../../lib/modules/public/IAlunaSymbolModule'



const log = debug('@aluna.js:bittrex/symbol/get')



export async function get (
  params: IAlunaSymbolGetParams,
): Promise<IAlunaSymbolGetReturns> {

  log('params', params)

  return params as any

}
