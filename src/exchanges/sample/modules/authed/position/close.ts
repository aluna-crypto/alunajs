import debug from 'debug'

import { AlunaError } from '../../../../../lib/core/AlunaError'
import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import { AlunaPositionStatusEnum } from '../../../../../lib/enums/AlunaPositionStatusEnum'
import { AlunaPositionErrorCodes } from '../../../../../lib/errors/AlunaPositionErrorCodes'
import {
  IAlunaPositionCloseParams,
  IAlunaPositionCloseReturns,
} from '../../../../../lib/modules/authed/IAlunaPositionModule'
import { IAlunaPositionSchema } from '../../../../../lib/schemas/IAlunaPositionSchema'
import { SampleHttp } from '../../../SampleHttp'
import { sampleEndpoints } from '../../../sampleSpecs'
import { ISamplePositionSchema } from '../../../schemas/ISamplePositionSchema'



const log = debug('@alunajs:sample/position/close')



export const close = (exchange: IAlunaExchangeAuthed) => async (
  params: IAlunaPositionCloseParams,
): Promise<IAlunaPositionCloseReturns> => {

  const {
    id,
    symbolPair,
    http = new SampleHttp(exchange.settings),
  } = params

  log('closing position', { id, symbolPair })

  const { credentials } = exchange

  const { position } = await exchange.position!.get({ id, symbolPair, http })

  if (position.status === AlunaPositionStatusEnum.CLOSED) {

    throw new AlunaError({
      code: AlunaPositionErrorCodes.ALREADY_CLOSED,
      message: 'Position is already closed',
      httpStatusCode: 200,
      metadata: position,
    })

  }

  // TODO: Properly close position
  await http.authedRequest<ISamplePositionSchema>({
    credentials,
    url: sampleEndpoints.position.close,
    body: { id, symbolPair },
  })

  const closedPosition: IAlunaPositionSchema = {
    ...position,
    status: AlunaPositionStatusEnum.CLOSED,
    closedAt: new Date(),
  }

  const { requestCount } = http

  return {
    position: closedPosition,
    requestCount,
  }

}
