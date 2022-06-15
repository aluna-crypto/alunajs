import { debug } from 'debug'

import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaOrderEditParams,
  IAlunaOrderEditReturns,
} from '../../../../../lib/modules/authed/IAlunaOrderModule'
import { editOrderParamsSchema } from '../../../../../utils/validation/schemas/editOrderParamsSchema'
import { validateParams } from '../../../../../utils/validation/validateParams'
import { OkxHttp } from '../../../OkxHttp'



const log = debug('alunajs:okx/order/edit')



export const edit = (exchange: IAlunaExchangeAuthed) => async (
  params: IAlunaOrderEditParams,
): Promise<IAlunaOrderEditReturns> => {

  log('editing order', params)

  validateParams({
    params,
    schema: editOrderParamsSchema,
  })

  log('editing order for Okx')

  const {
    id,
    rate,
    side,
    type,
    amount,
    account,
    symbolPair,
    limitRate,
    stopRate,
    http = new OkxHttp(exchange.settings),
  } = params

  await exchange.order.cancel({
    id,
    symbolPair,
    http,
    type,
  })

  const { order: newOrder } = await exchange.order.place({
    rate,
    side,
    type,
    amount,
    account,
    symbolPair,
    http,
    limitRate,
    stopRate,
  })

  const { requestWeight } = http

  return {
    order: newOrder,
    requestWeight,
  }

}
