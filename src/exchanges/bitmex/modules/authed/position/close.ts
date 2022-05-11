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
import { BitmexHttp } from '../../../BitmexHttp'
import { getBitmexEndpoints } from '../../../bitmexSpecs'
import { IBitmexPositionSchema } from '../../../schemas/IBitmexPositionSchema'



const log = debug('@alunajs:bitmex/position/close')



export const close = (exchange: IAlunaExchangeAuthed) => async (
  params: IAlunaPositionCloseParams,
): Promise<IAlunaPositionCloseReturns> => {

  const {
    settings,
    credentials,
  } = exchange

  const {
    id,
    symbolPair,
    http = new BitmexHttp(settings),
  } = params

  log('closing position', { id, symbolPair })

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
  await http.authedRequest<IBitmexPositionSchema>({
    credentials,
    url: getBitmexEndpoints(settings).position.close,
    body: { id, symbolPair },
  })

  const closedPosition: IAlunaPositionSchema = {
    ...position,
    status: AlunaPositionStatusEnum.CLOSED,
    closedAt: new Date(),
  }

  const { requestWeight } = http

  return {
    position: closedPosition,
    requestWeight,
  }

}
