import { debug } from 'debug'

import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import { AlunaHttpVerbEnum } from '../../../../../lib/enums/AlunaHtttpVerbEnum'
import {
  IAlunaBalanceListParams,
  IAlunaBalanceListRawReturns,
} from '../../../../../lib/modules/authed/IAlunaBalanceModule'
import { BinanceHttp } from '../../../BinanceHttp'
import { getBinanceEndpoints } from '../../../binanceSpecs'
import { IBinanceBalancesSchema } from '../../../schemas/IBinanceBalanceSchema'
import {
  IBinanceMarginAccountInfo,
  IBinanceSpotAccountInfo,
} from '../../../schemas/IBinanceKeySchema'



const log = debug('@alunajs:binance/balance/listRaw')



export const listRaw = (exchange: IAlunaExchangeAuthed) => async (
  params: IAlunaBalanceListParams = {},
): Promise<IAlunaBalanceListRawReturns<IBinanceBalancesSchema>> => {

  log('listing raw balances', params)

  const {
    settings,
    credentials,
  } = exchange

  const { http = new BinanceHttp(settings) } = params

  const {
    balances: spotBalances,
  } = await http.authedRequest<IBinanceSpotAccountInfo>({
    verb: AlunaHttpVerbEnum.GET,
    url: getBinanceEndpoints(settings).balance.listSpot,
    credentials,
    weight: 10,
  })

  const {
    userAssets: marginBalances,
  } = await http.authedRequest<IBinanceMarginAccountInfo>({
    verb: AlunaHttpVerbEnum.GET,
    url: getBinanceEndpoints(settings).balance.listMargin,
    credentials,
    weight: 10,
  })

  const rawBalances: IBinanceBalancesSchema = {
    spotBalances,
    marginBalances,
  }

  const { requestWeight } = http

  return {
    rawBalances,
    requestWeight,
  }

}
