import debug from 'debug'

import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaPositionListParams,
  IAlunaPositionListReturns,
} from '../../../../../lib/modules/authed/IAlunaPositionModule'
import { OkxHttp } from '../../../OkxHttp'



const log = debug('alunajs:okx/position/list')



export const list = (exchange: IAlunaExchangeAuthed) => async (
  params: IAlunaPositionListParams = {},
): Promise<IAlunaPositionListReturns> => {

  log('listing positions')

  const { http = new OkxHttp(exchange.settings) } = params

  const { rawPositions } = await exchange.position!.listRaw({ http })

  const { positions } = exchange.position!.parseMany({ rawPositions })

  const { requestWeight } = http

  return {
    positions,
    requestWeight,
  }

}
