import debug from 'debug'

import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaPositionGetLeverageParams,
  IAlunaPositionGetLeverageReturns,
} from '../../../../../lib/modules/authed/IAlunaPositionModule'
import { BitmexHttp } from '../../../BitmexHttp'
import { IBitmexPositionSchema } from '../../../schemas/IBitmexPositionSchema'



const log = debug('@alunajs:bitmex/position/getLeverage')



export const getLeverage = (exchange: IAlunaExchangeAuthed) => async (
  params: IAlunaPositionGetLeverageParams,
): Promise<IAlunaPositionGetLeverageReturns> => {

  const { settings } = exchange

  const {
    symbolPair,
    http = new BitmexHttp(settings),
  } = params

  log('getting leverage', { symbolPair })

  const { rawPosition } = await exchange.position!.getRaw({
    http,
    symbolPair,
  })

  const { bitmexPosition } = rawPosition as IBitmexPositionSchema

  const {
    leverage: positionLeverage,
    crossMargin,
  } = bitmexPosition

  const leverage = crossMargin
    ? 0
    : positionLeverage

  const { requestWeight } = http

  return {
    leverage,
    requestWeight,
  }

}
