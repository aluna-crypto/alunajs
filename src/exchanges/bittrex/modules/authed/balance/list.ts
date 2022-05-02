import { debug } from 'debug'

import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaBalanceListParams,
  IAlunaBalanceListReturns,
} from '../../../../../lib/modules/authed/IAlunaBalanceModule'
import { BittrexHttp } from '../../../BittrexHttp'
import { listRaw } from './listRaw'
import { parseMany } from './parseMany'



const log = debug('@aluna.js:bittrex/balance/list')



export const list = (exchange: IAlunaExchangeAuthed) => async (
  params: IAlunaBalanceListParams,
): Promise<IAlunaBalanceListReturns> => {

  log('params', params)

  const { http = new BittrexHttp() } = params

  const { rawBalances } = await listRaw(exchange)({ http })

  const { balances } = parseMany(exchange)({ rawBalances })

  const { requestCount } = http

  return {
    balances,
    requestCount,
  }

}
