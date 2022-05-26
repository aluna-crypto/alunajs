import debug from 'debug'

import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import { AlunaHttpVerbEnum } from '../../../../../lib/enums/AlunaHtttpVerbEnum'
import {
  IAlunaPositionGetLeverageParams,
  IAlunaPositionGetLeverageReturns,
} from '../../../../../lib/modules/authed/IAlunaPositionModule'
import { FtxHttp } from '../../../FtxHttp'
import { getFtxEndpoints } from '../../../ftxSpecs'



const log = debug('alunajs:bitmex/position/getLeverage')



export const getLeverage = (exchange: IAlunaExchangeAuthed) => async (
  params: IAlunaPositionGetLeverageParams,
): Promise<IAlunaPositionGetLeverageReturns> => {

  const {
    settings,
    credentials,
  } = exchange

  const { http = new FtxHttp(settings) } = params

  log('getting  FTX leverage')

  const { leverage } = await http.authedRequest<{ leverage: number}>({
    verb: AlunaHttpVerbEnum.GET,
    url: getFtxEndpoints(settings).position.getLeverage,
    credentials,
  })

  const { requestWeight } = http

  return {
    leverage,
    requestWeight,
  }

}
