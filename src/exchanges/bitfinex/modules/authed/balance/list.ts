import { debug } from 'debug'

import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaBalanceListParams,
  IAlunaBalanceListReturns,
} from '../../../../../lib/modules/authed/IAlunaBalanceModule'
import { BitfinexHttp } from '../../../BitfinexHttp'



const log = debug('@alunajs:bitfinex/balance/list')



export const list = (exchange: IAlunaExchangeAuthed) => async (
  params: IAlunaBalanceListParams = {},
): Promise<IAlunaBalanceListReturns> => {

  log('listing balances', params)

  const { http = new BitfinexHttp(exchange.settings) } = params

  const { rawBalances } = await exchange.balance.listRaw({ http })

  const { balances } = exchange.balance.parseMany({ rawBalances })

  const { requestWeight } = http

  return {
    balances,
    requestWeight,
  }

}
