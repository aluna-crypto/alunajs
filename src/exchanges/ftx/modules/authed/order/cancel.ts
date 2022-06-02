import { debug } from 'debug'

import { AlunaError } from '../../../../../lib/core/AlunaError'
import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import { AlunaHttpVerbEnum } from '../../../../../lib/enums/AlunaHtttpVerbEnum'
import { AlunaOrderTypesEnum } from '../../../../../lib/enums/AlunaOrderTypesEnum'
import { AlunaOrderErrorCodes } from '../../../../../lib/errors/AlunaOrderErrorCodes'
import {
  IAlunaOrderCancelParams,
  IAlunaOrderCancelReturns,
} from '../../../../../lib/modules/authed/IAlunaOrderModule'
import { FtxHttp } from '../../../FtxHttp'
import { getFtxEndpoints } from '../../../ftxSpecs'
import { IFtxOrderSchema } from '../../../schemas/IFtxOrderSchema'



const log = debug('alunajs:ftx/order/cancel')



export const cancel = (exchange: IAlunaExchangeAuthed) => async (
  params: IAlunaOrderCancelParams,
): Promise<IAlunaOrderCancelReturns> => {

  log('canceling order', params)

  const {
    settings,
    credentials,
  } = exchange

  const {
    id,
    type,
    symbolPair,
    http = new FtxHttp(settings),
  } = params

  if (!type) {

    throw new AlunaError({
      code: AlunaOrderErrorCodes.MISSING_PARAMS,
      message: 'Order type is required to cancel Ftx order',
      httpStatusCode: 400,
    })

  }

  try {

    const url = type === AlunaOrderTypesEnum.LIMIT
      ? getFtxEndpoints(settings).order.cancel(id)
      : getFtxEndpoints(settings).order.cancelTriggerOrder(id)

    await http.authedRequest<IFtxOrderSchema>({
      verb: AlunaHttpVerbEnum.DELETE,
      url,
      credentials,
    })

    const { order } = await exchange.order.get({
      id,
      symbolPair,
      http,
    })

    const { requestWeight } = http

    return {
      order,
      requestWeight,
    }

  } catch (err) {

    const {
      metadata,
      httpStatusCode,
    } = err

    const error = new AlunaError({
      message: 'Something went wrong, order not canceled',
      httpStatusCode,
      code: AlunaOrderErrorCodes.CANCEL_FAILED,
      metadata,
    })

    log(error)

    throw error

  }

}
