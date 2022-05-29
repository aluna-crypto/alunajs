import debug from 'debug'

import { AlunaError } from '../../../../../lib/core/AlunaError'
import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import { AlunaGenericErrorCodes } from '../../../../../lib/errors/AlunaGenericErrorCodes'
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

  if (!symbolPair) {

    throw new AlunaError({
      code: AlunaGenericErrorCodes.PARAM_ERROR,
      message: 'Symbol is required to get okx position',
      httpStatusCode: 400,
    })

  }

  log('getting raw position', { id })

  const [rawPosition] = await http.authedRequest<IOkxPositionSchema[]>({
    credentials,
    url: getOkxEndpoints(settings).position.get(symbolPair),
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
