import { debug } from 'debug'

import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import { AlunaHttpVerbEnum } from '../../../../../lib/enums/AlunaHtttpVerbEnum'
import {
  IAlunaBalanceListParams,
  IAlunaBalanceListRawReturns,
} from '../../../../../lib/modules/authed/IAlunaBalanceModule'
import { SampleHttp } from '../../../SampleHttp'
import { ISampleBalanceSchema } from '../../../schemas/ISampleBalanceSchema'



const log = debug('@aluna.js:sample/balance/listRaw')



export const listRaw = (exchange: IAlunaExchangeAuthed) => async (
  params: IAlunaBalanceListParams = {},
): Promise<IAlunaBalanceListRawReturns<ISampleBalanceSchema>> => {

  log('params', params)

  const { credentials } = exchange

  const { http = new SampleHttp() } = params

  // TODO: Implement balance 'listRaw'
  const rawBalances = await http.authedRequest<ISampleBalanceSchema[]>({
    verb: AlunaHttpVerbEnum.GET,
    url: '',
    credentials,
  })

  const { requestCount } = http

  return {
    rawBalances,
    requestCount,
  }

}
