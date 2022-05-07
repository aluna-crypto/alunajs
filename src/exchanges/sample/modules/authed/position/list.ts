import debug from 'debug'

import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaPositionListParams,
  IAlunaPositionListReturns,
} from '../../../../../lib/modules/authed/IAlunaPositionModule'
import { SampleHttp } from '../../../SampleHttp'



const log = debug('@alunajs:sample/position/list')



export const list = (exchange: IAlunaExchangeAuthed) => async (
  params: IAlunaPositionListParams = {},
): Promise<IAlunaPositionListReturns> => {

  log('listing positions')

  const { http = new SampleHttp() } = params

  const { rawPositions } = await exchange.position!.listRaw({ http })

  const { positions } = await exchange.position!.parseMany({ rawPositions })

  const { requestCount } = http

  return {
    positions,
    requestCount,
  }

}
