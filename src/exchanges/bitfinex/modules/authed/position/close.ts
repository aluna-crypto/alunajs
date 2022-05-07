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
import { BitfinexHttp } from '../../../BitfinexHttp'
import { placeMarketOrderToClosePosition } from './helpers/placeMarketOrderToClosePosition'
import { throwPositionIdRequiredFor } from './helpers/throwPositionIdRequiredFor'



const log = debug('@alunajs:bitfinex/position/close')



export const close = (exchange: IAlunaExchangeAuthed) => async (
  params: IAlunaPositionCloseParams,
): Promise<IAlunaPositionCloseReturns> => {

  const {
    id,
    http = new BitfinexHttp(),
  } = params

  log('closing position', id)

  if (!id) {
    throwPositionIdRequiredFor('closing Bitfinex positions')
  }

  const { position } = await exchange.position!.get({ id, http })

  if (position.status === AlunaPositionStatusEnum.CLOSED) {

    throw new AlunaError({
      code: AlunaPositionErrorCodes.ALREADY_CLOSED,
      message: 'Position is already closed',
      httpStatusCode: 400,
      metadata: position,
    })

  }

  await placeMarketOrderToClosePosition({
    http,
    exchange,
    position,
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
