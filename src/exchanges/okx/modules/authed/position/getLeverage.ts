import debug from 'debug'

import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaPositionGetLeverageParams,
  IAlunaPositionGetLeverageReturns,
} from '../../../../../lib/modules/authed/IAlunaPositionModule'
import { OkxHttp } from '../../../OkxHttp'
import { getOkxEndpoints } from '../../../okxSpecs'
import { IOkxPositionSchema } from '../../../schemas/IOkxPositionSchema'



const log = debug('alunajs:okx/position/getLeverage')



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
    http = new OkxHttp(settings),
  } = params

  log('getting leverage', { id, symbolPair })

  const { lever } = await http.authedRequest<IOkxPositionSchema>({
    credentials,
    url: getOkxEndpoints(settings).position.get(symbolPair),
    body: { id, symbolPair },
  })

  const { requestWeight } = http

  const leverage = Number(lever)

  return {
    leverage,
    requestWeight,
  }

}
