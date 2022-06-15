import { debug } from 'debug'

import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import { AlunaHttpVerbEnum } from '../../../../../lib/enums/AlunaHtttpVerbEnum'
import {
  IAlunaBalanceListParams,
  IAlunaBalanceListRawReturns,
} from '../../../../../lib/modules/authed/IAlunaBalanceModule'
import { OkxHttp } from '../../../OkxHttp'
import { getOkxEndpoints } from '../../../okxSpecs'
import {
  IOkxBalanceListSchema,
  IOkxBalanceSchema,
} from '../../../schemas/IOkxBalanceSchema'



const log = debug('alunajs:okx/balance/listRaw')



export const listRaw = (exchange: IAlunaExchangeAuthed) => async (
  params: IAlunaBalanceListParams = {},
): Promise<IAlunaBalanceListRawReturns<IOkxBalanceSchema[]>> => {

  log('listing raw balances', params)

  const {
    settings,
    credentials,
  } = exchange

  const { http = new OkxHttp(settings) } = params

  const rawBalanceInfo = await http.authedRequest<IOkxBalanceListSchema[]>({
    verb: AlunaHttpVerbEnum.GET,
    url: getOkxEndpoints(settings).balance.list,
    credentials,
  })

  const { details: rawBalances } = rawBalanceInfo[0]

  const { requestWeight } = http

  return {
    rawBalances,
    requestWeight,
  }

}
