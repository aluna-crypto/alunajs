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
import { IBitmexOrder } from '../../../schemas/IBitmexOrderSchema'



const log = debug('alunajs:bitmex/position/close')



export const close = (exchange: IAlunaExchangeAuthed) => async (
  params: IAlunaPositionCloseParams,
): Promise<IAlunaPositionCloseReturns> => {

  const {
    settings,
    credentials,
  } = exchange

  const {
    symbolPair,
    http = new BitmexHttp(settings),
  } = params

  log('closing position', { symbolPair })

  const { position } = await exchange.position!.get({
    symbolPair,
    http,
  })

  if (position.status === AlunaPositionStatusEnum.CLOSED) {

    throw new AlunaError({
      code: AlunaPositionErrorCodes.ALREADY_CLOSED,
      message: 'Position is already closed',
      metadata: position,
    })

  }

  const closeOrder = await http.authedRequest<IBitmexOrder>({
    credentials,
    url: getBitmexEndpoints(settings).position.close,
    body: { execInst: 'Close', symbol: symbolPair },
  })

  const closedPosition: IAlunaPositionSchema = {
    ...position,
    status: AlunaPositionStatusEnum.CLOSED,
    closedAt: new Date(),
    closePrice: closeOrder.price!,
  }

  const { requestWeight } = http

  return {
    position: closedPosition,
    requestWeight,
  }

}
