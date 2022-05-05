import { debug } from 'debug'

import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import { AlunaHttpVerbEnum } from '../../../../../lib/enums/AlunaHtttpVerbEnum'
import {
  IAlunaKeyFetchDetailsParams,
  IAlunaKeyFetchDetailsReturns,
} from '../../../../../lib/modules/authed/IAlunaKeyModule'
import { BitfinexHttp } from '../../../BitfinexHttp'
import { bitfinexEndpoints } from '../../../bitfinexSpecs'
import { IBitfinexKeySchema } from '../../../schemas/IBitfinexKeySchema'



const log = debug('@alunajs:bitfinex/key/fetchDetails')



export const fetchDetails = (exchange: IAlunaExchangeAuthed) => async (
  params: IAlunaKeyFetchDetailsParams = {},
): Promise<IAlunaKeyFetchDetailsReturns> => {

  log('fetching Bitfinex key permissions')

  const { credentials } = exchange

  const { http = new BitfinexHttp() } = params

  // TODO: Implement proper request
  const permissions = await http.authedRequest<IBitfinexKeySchema>({
    verb: AlunaHttpVerbEnum.GET,
    url: bitfinexEndpoints.key.fetchDetails,
    credentials,
  })

  const { key } = exchange.key.parseDetails({ rawKey: permissions })

  const { requestCount } = http

  return {
    key,
    requestCount,
  }

}
