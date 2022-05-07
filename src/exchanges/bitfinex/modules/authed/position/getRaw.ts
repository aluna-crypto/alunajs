import debug from 'debug'

import { AlunaError } from '../../../../../lib/core/AlunaError'
import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import { AlunaPositionErrorCodes } from '../../../../../lib/errors/AlunaPositionErrorCodes'
import {
  IAlunaPositionGetParams,
  IAlunaPositionGetRawReturns,
} from '../../../../../lib/modules/authed/IAlunaPositionModule'
import { BitfinexHttp } from '../../../BitfinexHttp'
import { bitfinexEndpoints } from '../../../bitfinexSpecs'
import { IBitfinexPositionSchema } from '../../../schemas/IBitfinexPositionSchema'
import { throwPositionIdRequiredFor } from './helpers/throwPositionIdRequiredFor'



const log = debug('@alunajs:bitfinex/position/getRaw')



export const getRaw = (exchange: IAlunaExchangeAuthed) => async (
  params: IAlunaPositionGetParams,
): Promise<IAlunaPositionGetRawReturns<IBitfinexPositionSchema>> => {

  const {
    id,
    http = new BitfinexHttp(),
  } = params

  log('getting raw position', { id })

  if (!id) {
    throwPositionIdRequiredFor('getting Bitfinex position')
  }

  const { credentials } = exchange

  const response = await http.authedRequest<IBitfinexPositionSchema[]>({
    credentials,
    url: bitfinexEndpoints.position.get,
    body: { id: [Number(id)], limit: 1 },
  })

  if (!response.length) {

    throw new AlunaError({
      code: AlunaPositionErrorCodes.NOT_FOUND,
      message: 'Position not found',
      httpStatusCode: 400,
      metadata: response,
    })

  }

  const { requestCount } = http

  return {
    rawPosition: response[0],
    requestCount,
  }

}
