import { debug } from 'debug'

import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import { AlunaHttpVerbEnum } from '../../../../../lib/enums/AlunaHtttpVerbEnum'
import {
  IAlunaBalanceListParams,
  IAlunaBalanceListRawReturns,
} from '../../../../../lib/modules/authed/IAlunaBalanceModule'
import { BittrexHttp } from '../../../BittrexHttp'
import { BITTREX_PRODUCTION_URL } from '../../../bittrexSpecs'
import { IBittrexBalanceSchema } from '../../../schemas/IBittrexBalanceSchema'



const log = debug('@alunajs:bittrex/balance/listRaw')



export const listRaw = (exchange: IAlunaExchangeAuthed) => async (
  params: IAlunaBalanceListParams = {},
): Promise<IAlunaBalanceListRawReturns<IBittrexBalanceSchema>> => {

  log('params', params)

  const { credentials } = exchange

  const { http = new BittrexHttp() } = params

  const rawBalances = await http.authedRequest<IBittrexBalanceSchema[]>({
    verb: AlunaHttpVerbEnum.GET,
    url: `${BITTREX_PRODUCTION_URL}/balances`,
    credentials,
  })

  const { requestCount } = http

  return {
    rawBalances,
    requestCount,
  }

}
