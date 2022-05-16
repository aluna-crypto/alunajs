import debug from 'debug'

import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaPositionSetLeverageParams,
  IAlunaPositionSetLeverageReturns,
} from '../../../../../lib/modules/authed/IAlunaPositionModule'
import { SampleHttp } from '../../../SampleHttp'
import { getSampleEndpoints } from '../../../sampleSpecs'



const log = debug('alunajs:sample/position/setLeverage')



export const setLeverage = (exchange: IAlunaExchangeAuthed) => async (
  params: IAlunaPositionSetLeverageParams,
): Promise<IAlunaPositionSetLeverageReturns> => {

  const {
    settings,
    credentials,
  } = exchange

  const {
    id,
    symbolPair,
    leverage,
    http = new SampleHttp(settings),
  } = params

  log('setting leverage', { id, symbolPair })

  // TODO: Implement proper getter
  const settedLeverage = await http.authedRequest<number>({
    credentials,
    url: getSampleEndpoints(settings).position.setLeverage,
    body: { id, symbolPair, leverage },
  })

  const { requestWeight } = http

  return {
    leverage: settedLeverage,
    requestWeight,
  }

}
