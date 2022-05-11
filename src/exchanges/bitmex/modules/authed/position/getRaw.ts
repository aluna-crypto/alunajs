import debug from 'debug'

import { AlunaError } from '../../../../../lib/core/AlunaError'
import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import { AlunaPositionErrorCodes } from '../../../../../lib/errors/AlunaPositionErrorCodes'
import {
  IAlunaPositionGetParams,
  IAlunaPositionGetRawReturns,
} from '../../../../../lib/modules/authed/IAlunaPositionModule'
import { BitmexHttp } from '../../../BitmexHttp'
import { getBitmexEndpoints } from '../../../bitmexSpecs'
import { IBitmexPositionSchema } from '../../../schemas/IBitmexPositionSchema'



const log = debug('@alunajs:bitmex/position/getRaw')



export const getRaw = (exchange: IAlunaExchangeAuthed) => async (
  params: IAlunaPositionGetParams,
): Promise<IAlunaPositionGetRawReturns<IBitmexPositionSchema>> => {

  const {
    settings,
    credentials,
  } = exchange

  const {
    id,
    symbolPair,
    http = new BitmexHttp(settings),
  } = params

  log('getting raw position', { id })

  // TODO: Implement proper request
  const rawPosition = await http.authedRequest<IBitmexPositionSchema>({
    credentials,
    url: getBitmexEndpoints(settings).position.get,
    body: { id, symbolPair },
  })

  if (!rawPosition) {

    throw new AlunaError({
      code: AlunaPositionErrorCodes.NOT_FOUND,
      message: 'Position not found',
      httpStatusCode: 200,
    })

  }

  const { requestWeight } = http

  return {
    rawPosition,
    requestWeight,
  }

}
