import { debug } from 'debug'

import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import { AlunaHttpVerbEnum } from '../../../../../lib/enums/AlunaHtttpVerbEnum'
import {
  IAlunaBalanceListParams,
  IAlunaBalanceListRawReturns,
} from '../../../../../lib/modules/authed/IAlunaBalanceModule'
import { FtxHttp } from '../../../FtxHttp'
import { getFtxEndpoints } from '../../../ftxSpecs'
import { IFtxBalanceSchema } from '../../../schemas/IFtxBalanceSchema'



const log = debug('@alunajs:ftx/balance/listRaw')



export const listRaw = (exchange: IAlunaExchangeAuthed) => async (
  params: IAlunaBalanceListParams = {},
): Promise<IAlunaBalanceListRawReturns<IFtxBalanceSchema[]>> => {

  log('listing raw balances', params)

  const {
    settings,
    credentials,
  } = exchange

  const { http = new FtxHttp(settings) } = params

  const rawBalances = await http.authedRequest<IFtxBalanceSchema[]>({
    verb: AlunaHttpVerbEnum.GET,
    url: getFtxEndpoints(settings).balance.list,
    credentials,
  })

  const { requestWeight } = http

  return {
    rawBalances,
    requestWeight,
  }

}
