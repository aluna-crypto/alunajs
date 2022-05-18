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
import { getValrEndpoints } from '../../../valrSpecs'



const log = debug('alunajs:valr/order/getRaw')



export const getRaw = (exchange: IAlunaExchangeAuthed) => async (
  params: IAlunaOrderGetParams,
): Promise<IAlunaOrderGetRawReturns<IValrOrderGetResponseSchema>> => {

  log('getting raw order', params)

  const {
    settings,
    credentials,
  } = exchange

  const {
    id,
    symbolPair,
    http = new ValrHttp(settings),
  } = params

  const urls = getValrEndpoints(settings)

  const valrOrder = await http.authedRequest<IValrOrderGetSchema>({
    credentials,
    verb: AlunaHttpVerbEnum.GET,
    url: urls.order.get(id, symbolPair),
  })

  const pairs = await http.publicRequest<IValrMarketCurrencyPairs[]>({
    url: urls.market.pairs,
  })

  const pair = pairs.find((p) => p.symbol === valrOrder.currencyPair)

  if (!pair) {

    throw new AlunaError({
      httpStatusCode: 200,
      message: `No symbol pair found for ${valrOrder.currencyPair}`,
      code: AlunaGenericErrorCodes.PARSER_ERROR,
    })

  }

  const rawOrder: IValrOrderGetResponseSchema = {
    pair,
    valrOrder,
  }

  const { requestWeight } = http

  return {
    rawOrder,
    requestWeight,
  }

}
