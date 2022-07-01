import { debug } from 'debug'

import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import { AlunaHttpVerbEnum } from '../../../../../lib/enums/AlunaHtttpVerbEnum'
import {
  IAlunaBalanceListParams,
  IAlunaBalanceListRawReturns,
} from '../../../../../lib/modules/authed/IAlunaBalanceModule'
import { HuobiHttp } from '../../../HuobiHttp'
import { getHuobiEndpoints } from '../../../huobiSpecs'
import { IHuobiBalanceListSchema, IHuobiBalanceSchema } from '../../../schemas/IHuobiBalanceSchema'
import { getHuobiAccountId } from '../helpers/getHuobiAccountId'



const log = debug('alunajs:huobi/balance/listRaw')



export const listRaw = (exchange: IAlunaExchangeAuthed) => async (
  params: IAlunaBalanceListParams = {},
): Promise<IAlunaBalanceListRawReturns<IHuobiBalanceSchema[]>> => {

  log('listing raw balances', params)

  const {
    settings,
    credentials,
  } = exchange

  const { http = new HuobiHttp(settings) } = params

  const { accountId } = await getHuobiAccountId({
    credentials,
    http,
    settings,
  })

  const {
    list: rawBalances,
  } = await http.authedRequest<IHuobiBalanceListSchema>({
    verb: AlunaHttpVerbEnum.GET,
    url: getHuobiEndpoints(settings).balance.list(accountId),
    credentials,
  })

  const { requestWeight } = http

  return {
    rawBalances,
    requestWeight,
  }

}
