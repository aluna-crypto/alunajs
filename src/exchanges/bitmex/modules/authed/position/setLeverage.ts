import debug from 'debug'

import { AlunaError } from '../../../../../lib/core/AlunaError'
import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import { AlunaBalanceErrorCodes } from '../../../../../lib/errors/AlunaBalanceErrorCodes'
import {
  IAlunaPositionSetLeverageParams,
  IAlunaPositionSetLeverageReturns,
} from '../../../../../lib/modules/authed/IAlunaPositionModule'
import { BitmexHttp } from '../../../BitmexHttp'
import { getBitmexEndpoints } from '../../../bitmexSpecs'



const log = debug('alunajs:bitmex/position/setLeverage')



export const setLeverage = (exchange: IAlunaExchangeAuthed) => async (
  params: IAlunaPositionSetLeverageParams,
): Promise<IAlunaPositionSetLeverageReturns> => {

  const {
    settings,
    credentials,
  } = exchange

  const {
    symbolPair,
    leverage,
    http = new BitmexHttp(settings),
  } = params

  log('setting leverage', { symbolPair })

  try {

    const {
      leverage: settedLeverage,
    } = await http.authedRequest<{ leverage: number }>({
      credentials,
      url: getBitmexEndpoints(settings).position.setLeverage,
      body: { symbol: symbolPair, leverage },
    })

    const { requestWeight } = http

    return {
      leverage: settedLeverage,
      requestWeight,
    }

  } catch (err) {

    let {
      code,
      message,
      httpStatusCode,
    } = err

    if (/(?=.*Account has zero)(?=.*margin balance).+/g.test(err.message)) {

      code = AlunaBalanceErrorCodes.INSUFFICIENT_BALANCE

      message = `Cannot set leverage for ${symbolPair} because of `
        .concat('insufficient balance')

      httpStatusCode = 400

    }

    const alunaError = new AlunaError({
      code,
      message,
      httpStatusCode,
      metadata: err.metadata,
    })

    log(alunaError)

    throw alunaError

  }

}
