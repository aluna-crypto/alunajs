import { debug } from 'debug'

import { AlunaError } from '../../../../../lib/core/AlunaError'
import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import { AlunaHttpVerbEnum } from '../../../../../lib/enums/AlunaHtttpVerbEnum'
import { AlunaGenericErrorCodes } from '../../../../../lib/errors/AlunaGenericErrorCodes'
import {
  IAlunaOrderGetParams,
  IAlunaOrderGetRawReturns,
} from '../../../../../lib/modules/authed/IAlunaOrderModule'
import { IValrMarketCurrencyPairs } from '../../../schemas/IValrMarketSchema'
import {
  IValrOrderGetResponseSchema,
  IValrOrderGetSchema,
} from '../../../schemas/IValrOrderSchema'
import { ValrHttp } from '../../../ValrHttp'
import { valrEndpoints } from '../../../valrSpecs'



const log = debug('@alunajs:valr/order/getRaw')



export const getRaw = (exchange: IAlunaExchangeAuthed) => async (
  params: IAlunaOrderGetParams,
): Promise<IAlunaOrderGetRawReturns<IValrOrderGetResponseSchema>> => {

  log('getting raw order', params)

  const { credentials } = exchange

  const {
    id,
    symbolPair,
    http = new ValrHttp(exchange.settings),
  } = params

  const order = await http.authedRequest<IValrOrderGetSchema>({
    credentials,
    verb: AlunaHttpVerbEnum.GET,
    url: valrEndpoints.order.get(id, symbolPair),
  })

  const pairs = await http.publicRequest<IValrMarketCurrencyPairs[]>({
    url: valrEndpoints.market.pairs,
  })

  const pair = pairs.find((p) => p.symbol === order.currencyPair)

  if (!pair) {

    throw new AlunaError({
      httpStatusCode: 200,
      message: `No symbol pair found for ${order.currencyPair}`,
      code: AlunaGenericErrorCodes.PARSER_ERROR,
    })

  }

  const rawOrder: IValrOrderGetResponseSchema = {
    pair,
    order,
  }

  const { requestCount } = http

  return {
    rawOrder,
    requestCount,
  }

}
