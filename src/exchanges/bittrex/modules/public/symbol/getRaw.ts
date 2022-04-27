import debug from 'debug'

import {
  IAlunaSymbolGetParams,
  IAlunaSymbolGetRawReturns,
} from '../../../../../lib/modules/public/IAlunaSymbolModule'
import { IBittrexSymbolSchema } from '../../../schemas/IBittrexSymbolSchema'



const log = debug('@aluna.js:bittrex/symbol/getRaw')



export async function getRaw (
  params: IAlunaSymbolGetParams,
): Promise<IAlunaSymbolGetRawReturns<IBittrexSymbolSchema>> {

  log('params', params)

  return params as any

}
