import { debug } from 'debug'

import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import { AlunaOrderTypesEnum } from '../../../../../lib/enums/AlunaOrderTypesEnum'
import {
  IAlunaOrderEditParams,
  IAlunaOrderEditReturns,
} from '../../../../../lib/modules/authed/IAlunaOrderModule'
import { editOrderParamsSchema } from '../../../../../utils/validation/schemas/editOrderParamsSchema'
import { validateParams } from '../../../../../utils/validation/validateParams'
import { BinanceHttp } from '../../../BinanceHttp'



const log = debug('alunajs:binance/order/edit')



export const edit = (exchange: IAlunaExchangeAuthed) => async (
  params: IAlunaOrderEditParams,
): Promise<IAlunaOrderEditReturns> => {

  log('editing order', params)

  validateParams({
    params,
    schema: editOrderParamsSchema,
  })

  log('editing order for Binance')

  const {
    id,
    rate,
    side,
    type,
    amount,
    account,
    symbolPair,
    http = new BinanceHttp(exchange.settings),
  } = params

  await exchange.order.cancel({
    id,
    symbolPair,
    http,
    type: AlunaOrderTypesEnum.LIMIT,
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
