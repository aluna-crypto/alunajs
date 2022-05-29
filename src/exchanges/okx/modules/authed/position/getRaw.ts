import debug from 'debug'

import { AlunaError } from '../../../../../lib/core/AlunaError'
import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import { AlunaPositionErrorCodes } from '../../../../../lib/errors/AlunaPositionErrorCodes'
import {
  IAlunaPositionGetParams,
  IAlunaPositionGetRawReturns,
} from '../../../../../lib/modules/authed/IAlunaPositionModule'
import { OkxHttp } from '../../../OkxHttp'
import { getOkxEndpoints } from '../../../okxSpecs'
import { IOkxPositionSchema } from '../../../schemas/IOkxPositionSchema'



const log = debug('alunajs:okx/position/getRaw')



export const getRaw = (exchange: IAlunaExchangeAuthed) => async (
  params: IAlunaPositionGetParams,
): Promise<IAlunaPositionGetRawReturns<IOkxPositionSchema>> => {

  const {
    settings,
    credentials,
  } = exchange

  const {
    id,
    symbolPair,
    http = new OkxHttp(settings),
  } = params

  log('getting raw position', { id })

  // TODO: Implement proper request
  const rawPosition = await http.authedRequest<IOkxPositionSchema>({
    credentials,
    url: getOkxEndpoints(settings).position.get,
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
