import debug from 'debug'

import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import { AlunaHttpVerbEnum } from '../../../../../lib/enums/AlunaHtttpVerbEnum'
import {
  IAlunaPositionSetLeverageParams,
  IAlunaPositionSetLeverageReturns,
} from '../../../../../lib/modules/authed/IAlunaPositionModule'
import { FtxHttp } from '../../../FtxHttp'
import { getFtxEndpoints } from '../../../ftxSpecs'



const log = debug('alunajs:bitmex/position/setLeverage')



export const setLeverage = (exchange: IAlunaExchangeAuthed) => async (
  params: IAlunaPositionSetLeverageParams,
): Promise<IAlunaPositionSetLeverageReturns> => {

  const {
    settings,
    credentials,
  } = exchange

  const {
    leverage,
    http = new FtxHttp(settings),
  } = params

  log('setting FTX leverage', { leverage })

  await http.authedRequest<void>({
    credentials,
    url: getFtxEndpoints(settings).position.setLeverage,
    body: { leverage },
    verb: AlunaHttpVerbEnum.POST,
  })

  const { requestWeight } = http

  return {
    leverage,
    requestWeight,
  }

}
