import { debug } from 'debug'
import { find } from 'lodash'

import { AlunaError } from '../../../../../lib/core/AlunaError'
import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import { AlunaHttpVerbEnum } from '../../../../../lib/enums/AlunaHtttpVerbEnum'
import { AlunaOrderTypesEnum } from '../../../../../lib/enums/AlunaOrderTypesEnum'
import { AlunaGenericErrorCodes } from '../../../../../lib/errors/AlunaGenericErrorCodes'
import {
  IAlunaOrderGetParams,
  IAlunaOrderGetRawReturns,
} from '../../../../../lib/modules/authed/IAlunaOrderModule'
import { HuobiHttp } from '../../../HuobiHttp'
import { getHuobiEndpoints } from '../../../huobiSpecs'
import {
  IHuobiOrderResponseSchema,
  IHuobiOrderSchema,
} from '../../../schemas/IHuobiOrderSchema'



const log = debug('alunajs:huobi/order/getRaw')



export const getRaw = (exchange: IAlunaExchangeAuthed) => async (
  params: IAlunaOrderGetParams,
): Promise<IAlunaOrderGetRawReturns<IHuobiOrderResponseSchema>> => {

  log('getting raw order', params)

  const {
    settings,
    credentials,
  } = exchange

  const {
    id,
    type,
    clientOrderId,
    http = new HuobiHttp(settings),
  } = params

  const isConditionalorder = (type === AlunaOrderTypesEnum.STOP_LIMIT)
    || (type === AlunaOrderTypesEnum.STOP_MARKET)

  if (isConditionalorder && !clientOrderId) {

    throw new AlunaError({
      httpStatusCode: 200,
      message: "param 'clientOrderId' is required for conditional orders",
      code: AlunaGenericErrorCodes.PARAM_ERROR,
      metadata: params,
    })

  }

  let query
  let url = getHuobiEndpoints(settings).order.get(id)

  if (isConditionalorder) {

    url = getHuobiEndpoints(settings).order.getConditional
    query = `clientOrderId=${clientOrderId}`

  } else {

    url = getHuobiEndpoints(settings).order.get(id)

  }

  const huobiOrder = await http.authedRequest<IHuobiOrderSchema>({
    credentials,
    verb: AlunaHttpVerbEnum.GET,
    url,
    ...(query ? { query } : {}),
  })

  const { symbol } = huobiOrder

  const { rawSymbols } = await exchange.symbol.listRaw({
    http,
  })

  const rawSymbol = find(rawSymbols, { symbol })

  const { requestWeight } = http

  const rawOrder: IHuobiOrderResponseSchema = {
    huobiOrder,
    rawSymbol,
  }

  return {
    rawOrder,
    requestWeight,
  }

}
