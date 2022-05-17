import { debug } from 'debug'

import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import { AlunaHttpVerbEnum } from '../../../../../lib/enums/AlunaHtttpVerbEnum'
import {
  IAlunaBalanceListParams,
  IAlunaBalanceListRawReturns,
} from '../../../../../lib/modules/authed/IAlunaBalanceModule'
import { GateHttp } from '../../../GateHttp'
import { getGateEndpoints } from '../../../gateSpecs'
import { IGateBalanceSchema } from '../../../schemas/IGateBalanceSchema'



const log = debug('alunajs:gate/balance/listRaw')



export const listRaw = (exchange: IAlunaExchangeAuthed) => async (
  params: IAlunaBalanceListParams = {},
): Promise<IAlunaBalanceListRawReturns<IGateBalanceSchema[]>> => {

  log('listing raw balances', params)

  const {
    settings,
    credentials,
  } = exchange

  const { http = new GateHttp(settings) } = params

  const rawBalances = await http.authedRequest<IGateBalanceSchema[]>({
    verb: AlunaHttpVerbEnum.GET,
    url: getGateEndpoints(settings).balance.list,
    credentials,
  })

  const { requestWeight } = http

  return {
    rawBalances,
    requestWeight,
  }

}
