import { debug } from 'debug'

import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import { AlunaHttpVerbEnum } from '../../../../../lib/enums/AlunaHtttpVerbEnum'
import {
  IAlunaKeyFetchDetailsParams,
  IAlunaKeyFetchDetailsReturns,
} from '../../../../../lib/modules/authed/IAlunaKeyModule'
import { BitmexHttp } from '../../../BitmexHttp'
import { getBitmexEndpoints } from '../../../bitmexSpecs'
import { IBitmexKeySchema } from '../../../schemas/IBitmexKeySchema'



const log = debug('@alunajs:bitmex/key/fetchDetails')



export const fetchDetails = (exchange: IAlunaExchangeAuthed) => async (
  params: IAlunaKeyFetchDetailsParams = {},
): Promise<IAlunaKeyFetchDetailsReturns> => {

  log('fetching Bitmex key permissions')

  const {
    settings,
    credentials,
  } = exchange

  const { http = new BitmexHttp(settings) } = params

  const rawKey = await http.authedRequest<IBitmexKeySchema[]>({
    verb: AlunaHttpVerbEnum.GET,
    url: getBitmexEndpoints(settings).key.fetchDetails,
    credentials,
  })

  const { key } = exchange.key.parseDetails({ rawKey })

  const { requestWeight } = http

  return {
    key,
    requestWeight,
  }

}
