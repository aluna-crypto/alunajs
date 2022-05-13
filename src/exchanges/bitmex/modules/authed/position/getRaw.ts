import debug from 'debug'

import { AlunaError } from '../../../../../lib/core/AlunaError'
import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import { AlunaHttpVerbEnum } from '../../../../../lib/enums/AlunaHtttpVerbEnum'
import { AlunaGenericErrorCodes } from '../../../../../lib/errors/AlunaGenericErrorCodes'
import { AlunaPositionErrorCodes } from '../../../../../lib/errors/AlunaPositionErrorCodes'
import {
  IAlunaPositionGetParams,
  IAlunaPositionGetRawReturns,
} from '../../../../../lib/modules/authed/IAlunaPositionModule'
import { BitmexHttp } from '../../../BitmexHttp'
import { getBitmexEndpoints } from '../../../bitmexSpecs'
import {
  IBitmexPosition,
  IBitmexPositionSchema,
} from '../../../schemas/IBitmexPositionSchema'



const log = debug('@alunajs:bitmex/position/getRaw')



export const getRaw = (exchange: IAlunaExchangeAuthed) => async (
  params: IAlunaPositionGetParams,
): Promise<IAlunaPositionGetRawReturns<IBitmexPositionSchema>> => {

  const {
    settings,
    credentials,
  } = exchange

  const {
    symbolPair,
    http = new BitmexHttp(settings),
  } = params

  if (!symbolPair) {

    const error = new AlunaError({
      code: AlunaGenericErrorCodes.PARAM_ERROR,
      message: 'Position symbol is required to get Bitmex positions',
      httpStatusCode: 400,
    })

    log(error)

    throw error

  }

  log('getting raw position', { symbolPair })

  const [bitmexPosition] = await http.authedRequest<IBitmexPosition[]>({
    credentials,
    url: getBitmexEndpoints(settings).position.get,
    body: { filter: { symbol: symbolPair } },
    verb: AlunaHttpVerbEnum.GET,
  })

  if (!bitmexPosition) {

    throw new AlunaError({
      code: AlunaPositionErrorCodes.NOT_FOUND,
      message: 'Position not found',
    })

  }

  const { market } = await exchange.market.get!({
    http,
    symbolPair,
  })

  const rawPosition: IBitmexPositionSchema = {
    bitmexPosition,
    market,
  }

  const { requestWeight } = http

  return {
    rawPosition,
    requestWeight,
  }

}
