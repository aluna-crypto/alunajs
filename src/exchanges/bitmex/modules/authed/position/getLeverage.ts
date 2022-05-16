import debug from 'debug'

import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import { AlunaPositionErrorCodes } from '../../../../../lib/errors/AlunaPositionErrorCodes'
import {
  IAlunaPositionGetLeverageParams,
  IAlunaPositionGetLeverageReturns,
} from '../../../../../lib/modules/authed/IAlunaPositionModule'
import { BitmexHttp } from '../../../BitmexHttp'
import { IBitmexPosition } from '../../../schemas/IBitmexPositionSchema'



const log = debug('alunajs:bitmex/position/getLeverage')



export const getLeverage = (exchange: IAlunaExchangeAuthed) => async (
  params: IAlunaPositionGetLeverageParams,
): Promise<IAlunaPositionGetLeverageReturns> => {

  const { settings } = exchange

  const {
    symbolPair,
    http = new BitmexHttp(settings),
  } = params

  log('getting leverage', { symbolPair })

  let leverage: number
  let bitmexPosition: IBitmexPosition | undefined

  try {

    const { rawPosition } = await exchange.position!.getRaw({
      http,
      symbolPair,
    })

    bitmexPosition = rawPosition.bitmexPosition

  } catch (err) {

    if (err.code !== AlunaPositionErrorCodes.NOT_FOUND) {

      throw err

    }

  }

  if (bitmexPosition) {

    const {
      leverage: positionLeverage,
      crossMargin,
    } = bitmexPosition

    leverage = crossMargin
      ? 0
      : positionLeverage

  } else {

    leverage = 0

  }

  const { requestWeight } = http

  return {
    leverage,
    requestWeight,
  }

}
