import debug from 'debug'

import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaPositionParseParams,
  IAlunaPositionParseReturns,
} from '../../../../../lib/modules/authed/IAlunaPositionModule'
import { IBitfinexPositionSchema } from '../../../schemas/IBitfinexPositionSchema'



const log = debug('@alunajs:bitfinex/position/parse')



export const parse = (exchange: IAlunaExchangeAuthed) => (
  params: IAlunaPositionParseParams<IBitfinexPositionSchema>,
): IAlunaPositionParseReturns => {

  log('params', params)

  return params as any

}
