import { debug } from 'debug'

import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import { AlunaHttpVerbEnum } from '../../../../../lib/enums/AlunaHtttpVerbEnum'
import {
  IAlunaBalanceListParams,
  IAlunaBalanceListRawReturns,
} from '../../../../../lib/modules/authed/IAlunaBalanceModule'
import { BitmexHttp } from '../../../BitmexHttp'
import { getBitmexEndpoints } from '../../../bitmexSpecs'
import {
  IBitmexAsset,
  IBitmexAssetDetails,
  IBitmexBalancesSchema,
} from '../../../schemas/IBitmexBalanceSchema'



const log = debug('alunajs:bitmex/balance/listRaw')



export const listRaw = (exchange: IAlunaExchangeAuthed) => async (
  params: IAlunaBalanceListParams = {},
): Promise<IAlunaBalanceListRawReturns<IBitmexBalancesSchema>> => {

  log('listing raw balances', params)

  const {
    settings,
    credentials,
  } = exchange

  const { http = new BitmexHttp(settings) } = params

  const assets = await http.authedRequest<IBitmexAsset[]>({
    verb: AlunaHttpVerbEnum.GET,
    url: getBitmexEndpoints(settings).balance.assets,
    body: { currency: 'all' },
    credentials,
  })

  const assetsDetails = await http.authedRequest<IBitmexAssetDetails[]>({
    verb: AlunaHttpVerbEnum.GET,
    url: getBitmexEndpoints(settings).balance.assetsDetails,
    credentials,
  })

  const rawBalances: IBitmexBalancesSchema = {
    assets,
    assetsDetails,
  }

  const { requestWeight } = http

  return {
    rawBalances,
    requestWeight,
  }

}
