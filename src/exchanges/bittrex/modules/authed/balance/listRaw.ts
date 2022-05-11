import { debug } from 'debug'

import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import { AlunaHttpVerbEnum } from '../../../../../lib/enums/AlunaHtttpVerbEnum'
import {
  IAlunaBalanceListParams,
  IAlunaBalanceListRawReturns,
} from '../../../../../lib/modules/authed/IAlunaBalanceModule'
import { BittrexHttp } from '../../../BittrexHttp'
import { getBittrexEndpoints } from '../../../bittrexSpecs'
import { IBittrexBalanceSchema } from '../../../schemas/IBittrexBalanceSchema'



const log = debug('@alunajs:bittrex/balance/listRaw')



export const listRaw = (exchange: IAlunaExchangeAuthed) => async (
  params: IAlunaBalanceListParams = {},
): Promise<IAlunaBalanceListRawReturns<IBittrexBalanceSchema[]>> => {

  log('listing balances', params)

  const {
    settings,
    credentials,
  } = exchange

  const { http = new BittrexHttp(settings) } = params

  const rawBalances = await http.authedRequest<IBittrexBalanceSchema[]>({
    verb: AlunaHttpVerbEnum.GET,
    url: getBittrexEndpoints(settings).balance.list,
    credentials,
  })

  const { requestWeight } = http

  return {
    rawBalances,
    requestWeight,
  }

}
