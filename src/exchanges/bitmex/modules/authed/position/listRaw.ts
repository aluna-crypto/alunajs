import debug from 'debug'

import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import { AlunaHttpVerbEnum } from '../../../../../lib/enums/AlunaHtttpVerbEnum'
import {
  IAlunaPositionListParams,
  IAlunaPositionListRawReturns,
} from '../../../../../lib/modules/authed/IAlunaPositionModule'
import { BitmexHttp } from '../../../BitmexHttp'
import { getBitmexEndpoints } from '../../../bitmexSpecs'
import {
  IBitmexPosition,
  IBitmexPositionsSchema,
} from '../../../schemas/IBitmexPositionSchema'



const log = debug('alunajs:bitmex/position/listRaw')



export const listRaw = (exchange: IAlunaExchangeAuthed) => async (
  params: IAlunaPositionListParams = {},
): Promise<IAlunaPositionListRawReturns<IBitmexPositionsSchema>> => {

  log('listing raw positions', params)

  const {
    settings,
    credentials,
  } = exchange

  const {
    http = new BitmexHttp(settings),
  } = params

  const bitmexPositions = await http.authedRequest<IBitmexPosition[]>({
    credentials,
    url: getBitmexEndpoints(settings).position.list,
    verb: AlunaHttpVerbEnum.GET,
    body: { filter: { isOpen: true } },
  })

  const { markets } = await exchange.market.list({ http })

  const rawPositions: IBitmexPositionsSchema = {
    bitmexPositions,
    markets,
  }

  const { requestWeight } = http

  return {
    rawPositions,
    requestWeight,
  }

}
