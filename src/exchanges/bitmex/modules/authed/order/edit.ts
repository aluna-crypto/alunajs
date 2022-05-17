import { debug } from 'debug'

import { AlunaError } from '../../../../../lib/core/AlunaError'
import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import { AlunaHttpVerbEnum } from '../../../../../lib/enums/AlunaHtttpVerbEnum'
import { AlunaBalanceErrorCodes } from '../../../../../lib/errors/AlunaBalanceErrorCodes'
import {
  IAlunaOrderEditParams,
  IAlunaOrderEditReturns,
} from '../../../../../lib/modules/authed/IAlunaOrderModule'
import { ensureOrderIsSupported } from '../../../../../utils/orders/ensureOrderIsSupported'
import { editOrderParamsSchema } from '../../../../../utils/validation/schemas/editOrderParamsSchema'
import { validateParams } from '../../../../../utils/validation/validateParams'
import { BitmexHttp } from '../../../BitmexHttp'
import { getBitmexEndpoints } from '../../../bitmexSpecs'
import {
  IBitmexOrder,
  IBitmexOrderSchema,
} from '../../../schemas/IBitmexOrderSchema'
import { assembleRequestBody } from './helpers/assembleRequestBody'



const log = debug('alunajs:bitmex/order/edit')



export const edit = (exchange: IAlunaExchangeAuthed) => async (
  params: IAlunaOrderEditParams,
): Promise<IAlunaOrderEditReturns> => {

  log('editing order', params)

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
    orderPlaceParams: params,
  })

  log('editing order for Bitmex')

  const {
    symbolPair,
    http = new BitmexHttp(exchange.settings),
  } = params

  const { market } = await exchange.market.get!({
    symbolPair,
    http,
  })

  const { body } = assembleRequestBody({
    action: 'edit',
    instrument: market.instrument!,
    orderParams: params,
    settings,
  })

  try {

    const bitmexOrder = await http.authedRequest<IBitmexOrder>({
      url: getBitmexEndpoints(settings).order.edit,
      verb: AlunaHttpVerbEnum.PUT,
      body,
      credentials,
    })

    const rawOrder: IBitmexOrderSchema = {
      bitmexOrder,
      market,
    }

    const { order } = exchange.order.parse({ rawOrder })

    const { requestWeight } = http

    return {
      order,
      requestWeight,
    }

  } catch (err) {

    const { message } = err

    let { code } = err

    if (/insufficient Available Balance/i.test(message)) {

      code = AlunaBalanceErrorCodes.INSUFFICIENT_BALANCE

    }

    throw new AlunaError({
      ...err,
      code,
    })

  }

}
