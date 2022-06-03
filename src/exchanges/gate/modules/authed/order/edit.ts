import { debug } from 'debug'

import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import { AlunaOrderTypesEnum } from '../../../../../lib/enums/AlunaOrderTypesEnum'
import {
  IAlunaOrderEditParams,
  IAlunaOrderEditReturns,
} from '../../../../../lib/modules/authed/IAlunaOrderModule'
import { editOrderParamsSchema } from '../../../../../utils/validation/schemas/editOrderParamsSchema'
import { validateParams } from '../../../../../utils/validation/validateParams'
import { GateHttp } from '../../../GateHttp'



const log = debug('alunajs:gate/order/edit')



export const edit = (exchange: IAlunaExchangeAuthed) => async (
  params: IAlunaOrderEditParams,
): Promise<IAlunaOrderEditReturns> => {

  log('edting order', params)

  const { settings } = exchange

  validateParams({
    params,
    schema: editOrderParamsSchema,
  })

  log('editing order for Gate')

  const {
    id,
    rate,
    side,
    type,
    amount,
    account,
    symbolPair,
    http = new GateHttp(settings),
  } = params

  await exchange.order.cancel({
    id,
    symbolPair,
    type: AlunaOrderTypesEnum.LIMIT,
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

  const { requestWeight } = http

  return {
    order: newOrder,
    requestWeight,
  }

}
