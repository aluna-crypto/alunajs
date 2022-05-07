import debug from 'debug'

import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaPositionGetParams,
  IAlunaPositionGetRawReturns,
} from '../../../../../lib/modules/authed/IAlunaPositionModule'
import { IBitfinexPositionSchema } from '../../../schemas/IBitfinexPositionSchema'



const log = debug('@alunajs:bitfinex/position/getRaw')



export const getRaw = (exchange: IAlunaExchangeAuthed) => async (
  params: IAlunaPositionGetParams,
): Promise<IAlunaPositionGetRawReturns<IBitfinexPositionSchema>> => {

  log('params', params)

  return params as any

}
