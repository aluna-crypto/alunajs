import { debug } from 'debug'

import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaOrderEditParams,
  IAlunaOrderEditReturns,
} from '../../../../../lib/modules/authed/IAlunaOrderModule'
import { editOrderParamsSchema } from '../../../../../utils/validation/schemas/editOrderParamsSchema'
import { validateParams } from '../../../../../utils/validation/validateParams'
import { BittrexHttp } from '../../../BittrexHttp'



const log = debug('@alunajs:bittrex/order/edit')



export const edit = (exchange: IAlunaExchangeAuthed) => async (
  params: IAlunaOrderEditParams,
): Promise<IAlunaOrderEditReturns> => {

  log('params', params)

  validateParams({
    params,
    schema: editOrderParamsSchema,
  })

  log('editing order for Bittrex')

  const {
    id,
    rate,
    side,
    type,
    amount,
    account,
    symbolPair,
    http = new BittrexHttp(),
  } = params

  await exchange.order.cancel({
    id,
    symbolPair,
    http,
  })

  const { order: newOrder } = await exchange.order.place({
    rate,
    side,
    type,
    amount,
    account,
    symbolPair,
    http,
  })

  const { requestCount } = http

  return {
    order: newOrder,
    requestCount,
  }

}
