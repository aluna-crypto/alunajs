import { debug } from 'debug'

import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaKeyFetchDetailsParams,
  IAlunaKeyFetchDetailsReturns,
} from '../../../../../lib/modules/authed/IAlunaKeyModule'
import { BitfinexHttp } from '../../../BitfinexHttp'
import { bitfinexEndpoints } from '../../../bitfinexSpecs'
import {
  IBitfinexKeySchema,
  IBitfinexPermissionsScope,
} from '../../../schemas/IBitfinexKeySchema'



const log = debug('@alunajs:bitfinex/key/fetchDetails')



export const fetchDetails = (exchange: IAlunaExchangeAuthed) => async (
  params: IAlunaKeyFetchDetailsParams = {},
): Promise<IAlunaKeyFetchDetailsReturns> => {

  log('fetching Bitfinex key permissions')

  const { credentials } = exchange

  const { http = new BitfinexHttp() } = params

  const permissionsScope = await http.authedRequest<IBitfinexPermissionsScope>({
    url: bitfinexEndpoints.key.fetchDetails,
    credentials,
  })

  const [accountId] = await http.authedRequest<string[]>({
    url: bitfinexEndpoints.key.account,
    credentials,
  })

  const rawKey: IBitfinexKeySchema = {
    accountId,
    permissionsScope,
  }

  const { key } = exchange.key.parseDetails({ rawKey })

  const { requestCount } = http

  return {
    key,
    requestCount,
  }

}
