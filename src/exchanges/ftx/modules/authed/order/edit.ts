import { debug } from 'debug'

import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import { AlunaOrderTypesEnum } from '../../../../../lib/enums/AlunaOrderTypesEnum'
import {
  IAlunaOrderEditParams,
  IAlunaOrderEditReturns,
} from '../../../../../lib/modules/authed/IAlunaOrderModule'
import { ensureOrderIsSupported } from '../../../../../utils/orders/ensureOrderIsSupported'
import { editOrderParamsSchema } from '../../../../../utils/validation/schemas/editOrderParamsSchema'
import { validateParams } from '../../../../../utils/validation/validateParams'
import { FtxHttp } from '../../../FtxHttp'
import { getFtxEndpoints } from '../../../ftxSpecs'
import { IFtxOrderSchema } from '../../../schemas/IFtxOrderSchema'



const log = debug('alunajs:ftx/order/edit')



export const edit = (exchange: IAlunaExchangeAuthed) => async (
  params: IAlunaOrderEditParams,
): Promise<IAlunaOrderEditReturns> => {

  log('editing order for Ftx', params)

  const {
    specs,
    settings,
    credentials,
  } = exchange

  validateParams({
    params,
    schema: editOrderParamsSchema,
  })

  ensureOrderIsSupported({
    exchangeSpecs: specs,
    orderParams: params,
  })

  const {
    id,
    rate,
    amount,
    stopRate,
    limitRate,
    type,
    http = new FtxHttp(settings),
  } = params

  const body: Record<string, any> = {}

  let url: string

  switch (type) {

    case AlunaOrderTypesEnum.STOP_LIMIT:
      url = getFtxEndpoints(settings).order.editTrigger(id)
      body.triggerPrice = stopRate
      body.orderPrice = limitRate
      body.size = amount
      break

    case AlunaOrderTypesEnum.STOP_MARKET:
      url = getFtxEndpoints(settings).order.editTrigger(id)
      body.triggerPrice = stopRate
      body.size = amount
      break

    // Limit orders
    default:
      url = getFtxEndpoints(settings).order.edit(id)
      body.price = rate
      body.size = amount

  }

  const editedOrder = await http.authedRequest<IFtxOrderSchema>({
    url,
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
