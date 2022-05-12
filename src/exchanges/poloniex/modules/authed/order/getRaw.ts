import { debug } from 'debug'

import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import { AlunaHttpVerbEnum } from '../../../../../lib/enums/AlunaHtttpVerbEnum'
import {
  IAlunaOrderGetParams,
  IAlunaOrderGetRawReturns,
} from '../../../../../lib/modules/authed/IAlunaOrderModule'
import { PoloniexHttp } from '../../../PoloniexHttp'
import { getPoloniexEndpoints } from '../../../poloniexSpecs'
import { IPoloniexOrderSchema } from '../../../schemas/IPoloniexOrderSchema'



const log = debug('@alunajs:poloniex/order/getRaw')



export const getRaw = (exchange: IAlunaExchangeAuthed) => async (
  params: IAlunaOrderGetParams,
): Promise<IAlunaOrderGetRawReturns<IPoloniexOrderSchema>> => {

  log('getting raw order', params)

  const {
    settings,
    credentials,
  } = exchange

  const {
    id,
    http = new PoloniexHttp(settings),
  } = params

  // TODO: Implement proper request
  const rawOrder = await http.authedRequest<any>({
    credentials,
    verb: AlunaHttpVerbEnum.GET,
    url: getPoloniexEndpoints(settings).order.get(id),
  })

  const { requestWeight } = http

  return {
    rawOrder,
    requestWeight,
  }

}
