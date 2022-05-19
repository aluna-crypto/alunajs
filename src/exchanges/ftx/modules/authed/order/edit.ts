import { debug } from 'debug'

import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaOrderEditParams,
  IAlunaOrderEditReturns,
} from '../../../../../lib/modules/authed/IAlunaOrderModule'
import { editOrderParamsSchema } from '../../../../../utils/validation/schemas/editOrderParamsSchema'
import { validateParams } from '../../../../../utils/validation/validateParams'
import { FtxHttp } from '../../../FtxHttp'
import { getFtxEndpoints } from '../../../ftxSpecs'
import { IFtxOrderSchema } from '../../../schemas/IFtxOrderSchema'



const log = debug('alunajs:ftx/order/edit')



export const edit = (exchange: IAlunaExchangeAuthed) => async (
  params: IAlunaOrderEditParams,
): Promise<IAlunaOrderEditReturns> => {

  log('editing order', params)

  validateParams({
    params,
    schema: editOrderParamsSchema,
  })

  log('editing order for Ftx')

  const {
    settings,
    credentials,
  } = exchange

  const {
    id,
    rate,
    amount,
    http = new FtxHttp(settings),
  } = params

  const body = {
    price: rate,
    size: amount,
  }

  const editedOrder = await http.authedRequest<IFtxOrderSchema>({
    url: getFtxEndpoints(settings).order.edit(id),
    credentials,
    body,
  })

  const { order } = exchange.order.parse({
    rawOrder: editedOrder,
  })

  const { requestWeight } = http

  return {
    order,
    requestWeight,
  }

}
