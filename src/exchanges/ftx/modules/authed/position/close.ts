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
import { placeMarketOrderToClosePosition } from '../../../../../utils/positions/placeMarketOrderToClosePosition'
import { FtxHttp } from '../../../FtxHttp'



const log = debug('alunajs:bitfinex/position/close')



export const close = (exchange: IAlunaExchangeAuthed) => async (
  params: IAlunaPositionCloseParams,
): Promise<IAlunaPositionCloseReturns> => {

  const {
    symbolPair,
    http = new FtxHttp(exchange.settings),
  } = params

  log('closing position', symbolPair)

  const { position } = await exchange.position!.get({ symbolPair, http })

  if (position.status === AlunaPositionStatusEnum.CLOSED) {

    throw new AlunaError({
      code: AlunaPositionErrorCodes.ALREADY_CLOSED,
      message: 'Position is already closed',
      httpStatusCode: 400,
      metadata: position,
    })

  }

  const { order } = await placeMarketOrderToClosePosition({
    http,
    exchange,
    position,
  })

  const closedPosition: IAlunaPositionSchema = {
    ...position,
    status: AlunaPositionStatusEnum.CLOSED,
    closedAt: new Date(),
    closePrice: order.rate!,
  }

  const { requestWeight } = http

  return {
    position: closedPosition,
    requestWeight,
  }

}
