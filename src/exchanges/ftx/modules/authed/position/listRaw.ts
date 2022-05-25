import debug from 'debug'

import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import { AlunaHttpVerbEnum } from '../../../../../lib/enums/AlunaHtttpVerbEnum'
import {
  IAlunaPositionListParams,
  IAlunaPositionListRawReturns,
} from '../../../../../lib/modules/authed/IAlunaPositionModule'
import { FtxHttp } from '../../../FtxHttp'
import { getFtxEndpoints } from '../../../ftxSpecs'



const log = debug('alunajs:bitfinex/position/listRaw')



export const listRaw = (exchange: IAlunaExchangeAuthed) => async (
  params: IAlunaPositionListParams = {},
): Promise<IAlunaPositionListRawReturns<any>> => {

  log('listing raw positions', params)

  const {
    settings,
    credentials,
  } = exchange

  const {
    http = new FtxHttp(settings),
  } = params

  const rawPositions = await http.authedRequest<any>({
    credentials,
    verb: AlunaHttpVerbEnum.GET,
    url: getFtxEndpoints(settings).position.list,
  })

  const { requestWeight } = http

  return {
    rawPositions,
    requestWeight,
  }

}
