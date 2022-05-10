import debug from 'debug'

import { AlunaError } from '../../../../../lib/core/AlunaError'
import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import { AlunaPositionErrorCodes } from '../../../../../lib/errors/AlunaPositionErrorCodes'
import {
  IAlunaPositionGetParams,
  IAlunaPositionGetRawReturns,
} from '../../../../../lib/modules/authed/IAlunaPositionModule'
import { SampleHttp } from '../../../SampleHttp'
import { getSampleEndpoints } from '../../../sampleSpecs'
import { ISamplePositionSchema } from '../../../schemas/ISamplePositionSchema'



const log = debug('@alunajs:sample/position/getRaw')



export const getRaw = (exchange: IAlunaExchangeAuthed) => async (
  params: IAlunaPositionGetParams,
): Promise<IAlunaPositionGetRawReturns<ISamplePositionSchema>> => {

  const {
    settings,
    credentials,
  } = exchange

  const {
    id,
    symbolPair,
    http = new SampleHttp(settings),
  } = params

  log('getting raw position', { id })

  // TODO: Implement proper request
  const rawPosition = await http.authedRequest<ISamplePositionSchema>({
    credentials,
    url: getSampleEndpoints(settings).position.get,
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
