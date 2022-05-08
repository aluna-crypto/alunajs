import debug from 'debug'

import { AlunaError } from '../../../../../lib/core/AlunaError'
import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import { AlunaPositionErrorCodes } from '../../../../../lib/errors/AlunaPositionErrorCodes'
import {
  IAlunaPositionGetParams,
  IAlunaPositionGetRawReturns,
} from '../../../../../lib/modules/authed/IAlunaPositionModule'
import { SampleHttp } from '../../../SampleHttp'
import { sampleEndpoints } from '../../../sampleSpecs'
import { ISamplePositionSchema } from '../../../schemas/ISamplePositionSchema'



const log = debug('@alunajs:sample/position/getRaw')



export const getRaw = (exchange: IAlunaExchangeAuthed) => async (
  params: IAlunaPositionGetParams,
): Promise<IAlunaPositionGetRawReturns<ISamplePositionSchema>> => {

  const {
    id,
    symbolPair,
    http = new SampleHttp(exchange.settings),
  } = params

  log('getting raw position', { id })

  const { credentials } = exchange

  // TODO: Implement proper request
  const rawPosition = await http.authedRequest<ISamplePositionSchema>({
    credentials,
    url: sampleEndpoints.position.get,
    body: { id, symbolPair },
  })

  if (!rawPosition) {

    throw new AlunaError({
      code: AlunaPositionErrorCodes.NOT_FOUND,
      message: 'Position not found',
      httpStatusCode: 200,
    })

  }

  const { requestCount } = http

  return {
    rawPosition,
    requestCount,
  }

}
