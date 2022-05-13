import { debug } from 'debug'

import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaBalanceListParams,
  IAlunaBalanceListRawReturns,
} from '../../../../../lib/modules/authed/IAlunaBalanceModule'
import { PoloniexHttp } from '../../../PoloniexHttp'
import { getPoloniexEndpoints } from '../../../poloniexSpecs'
import { IPoloniexBalanceSchema } from '../../../schemas/IPoloniexBalanceSchema'



const log = debug('@alunajs:poloniex/balance/listRaw')



export const listRaw = (exchange: IAlunaExchangeAuthed) => async (
  params: IAlunaBalanceListParams = {},
): Promise<IAlunaBalanceListRawReturns<IPoloniexBalanceSchema[]>> => {

  log('listing raw balances', params)

  const {
    settings,
    credentials,
  } = exchange

  const { http = new PoloniexHttp(settings) } = params

  const timestamp = new Date().getTime()
  const searchParams = new URLSearchParams()

  searchParams.append('command', 'returnCompleteBalances')
  searchParams.append('nonce', timestamp.toString())

  const rawBalances = await http.authedRequest<IPoloniexBalanceSchema[]>({
    url: getPoloniexEndpoints(settings).balance.list,
    credentials,
    body: searchParams,
  })

  const { requestWeight } = http

  return {
    rawBalances,
    requestWeight,
  }

}
