import { debug } from 'debug'

import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import { AlunaHttpVerbEnum } from '../../../../../lib/enums/AlunaHtttpVerbEnum'
import {
  IAlunaBalanceGetTradableBalanceParams,
  IAlunaBalanceGetTradableBalanceReturns,
} from '../../../../../lib/modules/authed/IAlunaBalanceModule'
import { FtxHttp } from '../../../FtxHttp'
import { getFtxEndpoints } from '../../../ftxSpecs'
import { IFtxAccountSchema } from '../../../schemas/IFtxKeySchema'



const log = debug('alunajs:bitfinex/balance/getTradableBalance')



export const getTradableBalance = (exchange: IAlunaExchangeAuthed) => async (
  params: IAlunaBalanceGetTradableBalanceParams,
): Promise<IAlunaBalanceGetTradableBalanceReturns> => {

  log('getting tradable balance', params)

  const {
    settings,
    credentials,
  } = exchange

  const { http = new FtxHttp(settings) } = params

  log('fetching Ftx tradable balance')

  const { freeCollateral } = await http.authedRequest<IFtxAccountSchema>({
    credentials,
    url: getFtxEndpoints(settings).balance.account,
    verb: AlunaHttpVerbEnum.GET,
  })

  const { requestWeight } = http

  return {
    tradableBalance: freeCollateral,
    requestWeight,
  }

}
