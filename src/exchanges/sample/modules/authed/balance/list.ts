import { debug } from 'debug'

import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaBalanceListParams,
  IAlunaBalanceListReturns,
} from '../../../../../lib/modules/authed/IAlunaBalanceModule'
import { SampleHttp } from '../../../SampleHttp'



const log = debug('@alunajs:sample/balance/list')



export const list = (exchange: IAlunaExchangeAuthed) => async (
  params: IAlunaBalanceListParams = {},
): Promise<IAlunaBalanceListReturns> => {

  log('listing balances', params)

  const { http = new SampleHttp(exchange.settings) } = params

  const { rawBalances } = await exchange.balance.listRaw({ http })

  const { balances } = exchange.balance.parseMany({ rawBalances })

  const { requestWeight } = http

  return {
    balances,
    requestWeight,
  }

}
