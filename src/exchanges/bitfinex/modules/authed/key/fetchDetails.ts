import { debug } from 'debug'

import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaKeyFetchDetailsParams,
  IAlunaKeyFetchDetailsReturns,
} from '../../../../../lib/modules/authed/IAlunaKeyModule'
import { BitfinexHttp } from '../../../BitfinexHttp'
import { getBitfinexEndpoints } from '../../../bitfinexSpecs'
import {
  IBitfinexKeySchema,
  IBitfinexPermissionsScope,
} from '../../../schemas/IBitfinexKeySchema'



const log = debug('alunajs:bitfinex/key/fetchDetails')



export const fetchDetails = (exchange: IAlunaExchangeAuthed) => async (
  params: IAlunaKeyFetchDetailsParams = {},
): Promise<IAlunaKeyFetchDetailsReturns> => {

  log('fetching Bitfinex key permissions')

  const {
    settings,
    credentials,
  } = exchange

  const { http = new BitfinexHttp(settings) } = params

  const permissionsScope = await http.authedRequest<IBitfinexPermissionsScope>({
    url: getBitfinexEndpoints(settings).key.fetchDetails,
    credentials,
  })

  const [accountId] = await http.authedRequest<string[]>({
    url: getBitfinexEndpoints(settings).key.account,
    credentials,
  })

  const rawKey: IBitfinexKeySchema = {
    accountId,
    permissionsScope,
  }

  const { key } = exchange.key.parseDetails({ rawKey })

  const { requestWeight } = http

  return {
    key,
    requestWeight,
  }

}
