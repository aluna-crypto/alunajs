import { debug } from 'debug'

import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import { AlunaHttpVerbEnum } from '../../../../../lib/enums/AlunaHtttpVerbEnum'
import {
  IAlunaBalanceListParams,
  IAlunaBalanceListRawReturns,
} from '../../../../../lib/modules/authed/IAlunaBalanceModule'
import { BitmexHttp } from '../../../BitmexHttp'
import { getBitmexEndpoints } from '../../../bitmexSpecs'
import { IBitmexBalanceSchema } from '../../../schemas/IBitmexBalanceSchema'



const log = debug('@alunajs:bitmex/balance/listRaw')



export const listRaw = (exchange: IAlunaExchangeAuthed) => async (
  params: IAlunaBalanceListParams = {},
): Promise<IAlunaBalanceListRawReturns<IBitmexBalanceSchema>> => {

  log('listing raw balances', params)

  const {
    settings,
    credentials,
  } = exchange

  const { http = new BitmexHttp(settings) } = params

  // TODO: Implement balance 'listRaw'
  const rawBalances = await http.authedRequest<IBitmexBalanceSchema[]>({
    verb: AlunaHttpVerbEnum.GET,
    url: getBitmexEndpoints(settings).balance.list,
    credentials,
  })

  const { requestWeight } = http

  return {
    rawBalances,
    requestWeight,
  }

}
