import debug from 'debug'

import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaPositionListParams,
  IAlunaPositionListReturns,
} from '../../../../../lib/modules/authed/IAlunaPositionModule'
import { BitfinexHttp } from '../../../BitfinexHttp'



const log = debug('@alunajs:bitfinex/position/list')



export const list = (exchange: IAlunaExchangeAuthed) => async (
  params: IAlunaPositionListParams = {},
): Promise<IAlunaPositionListReturns> => {

  log('listing positions')

  const { http = new BitfinexHttp(exchange.settings) } = params

  const { rawPositions } = await exchange.position!.listRaw({ http })

  const { positions } = await exchange.position!.parseMany({ rawPositions })

  const { requestCount } = http

  return {
    positions,
    requestCount,
  }

}
