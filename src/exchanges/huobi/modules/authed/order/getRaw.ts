import { debug } from 'debug'
import { find } from 'lodash'

import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import { AlunaHttpVerbEnum } from '../../../../../lib/enums/AlunaHtttpVerbEnum'
import {
  IAlunaOrderGetParams,
  IAlunaOrderGetRawReturns,
} from '../../../../../lib/modules/authed/IAlunaOrderModule'
import { HuobiHttp } from '../../../HuobiHttp'
import { getHuobiEndpoints } from '../../../huobiSpecs'
import { IHuobiOrderResponseSchema, IHuobiOrderSchema } from '../../../schemas/IHuobiOrderSchema'



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
    http = new HuobiHttp(settings),
  } = params

  const rawOrder = await http.authedRequest<IHuobiOrderSchema>({
    credentials,
    verb: AlunaHttpVerbEnum.GET,
    url: getHuobiEndpoints(settings).order.get(id),
  })

  const { symbol } = rawOrder

  const { rawSymbols } = await exchange.symbol.listRaw({
    http,
  })

  const rawSymbol = find(
    rawSymbols,
    {
      symbol,
    },
  )

  const { requestWeight } = http

  const rawOrderResponse: IHuobiOrderResponseSchema = {
    rawOrder,
    rawSymbol,
  }

  return {
    rawOrder: rawOrderResponse,
    requestWeight,
  }

}
