import debug from 'debug'

import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaPositionGetLeverageParams,
  IAlunaPositionGetLeverageReturns,
} from '../../../../../lib/modules/authed/IAlunaPositionModule'
import { BitmexHttp } from '../../../BitmexHttp'
import { getBitmexEndpoints } from '../../../bitmexSpecs'



const log = debug('@alunajs:bitmex/position/getLeverage')



export const getLeverage = (exchange: IAlunaExchangeAuthed) => async (
  params: IAlunaPositionGetLeverageParams,
): Promise<IAlunaPositionGetLeverageReturns> => {

  const {
    settings,
    credentials,
  } = exchange

  const {
    id,
    symbolPair,
    http = new BitmexHttp(settings),
  } = params

  log('getting leverage', { id, symbolPair })

  // TODO: Implement proper getter
  const leverage = await http.authedRequest<number>({
    credentials,
    url: getBitmexEndpoints(settings).position.getLeverage,
    body: { id, symbolPair },
  })

  const { requestWeight } = http

  return {
    leverage,
    requestWeight,
  }

}
