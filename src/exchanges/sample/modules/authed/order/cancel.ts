import { debug } from 'debug'

import { AlunaError } from '../../../../../lib/core/AlunaError'
import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import { AlunaHttpVerbEnum } from '../../../../../lib/enums/AlunaHtttpVerbEnum'
import { AlunaOrderErrorCodes } from '../../../../../lib/errors/AlunaOrderErrorCodes'
import {
  IAlunaOrderCancelParams,
  IAlunaOrderCancelReturns,
} from '../../../../../lib/modules/authed/IAlunaOrderModule'
import { SampleHttp } from '../../../SampleHttp'
import { getSampleEndpoints } from '../../../sampleSpecs'
import { ISampleOrderSchema } from '../../../schemas/ISampleOrderSchema'



const log = debug('@alunajs:sample/order/cancel')



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
    http = new SampleHttp(settings),
  } = params

  try {

    // TODO: Implement proper request
    const rawOrder = await http.authedRequest<ISampleOrderSchema>({
      verb: AlunaHttpVerbEnum.DELETE,
      url: getSampleEndpoints(settings).order.get(id),
      credentials,
    })

    const { order } = exchange.order.parse({ rawOrder })

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
