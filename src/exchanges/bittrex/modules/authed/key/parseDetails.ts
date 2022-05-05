import { debug } from 'debug'

import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaKeyParseDetailsParams,
  IAlunaKeyParseDetailsReturns,
} from '../../../../../lib/modules/authed/IAlunaKeyModule'
import { IAlunaKeySchema } from '../../../../../lib/schemas/IAlunaKeySchema'
import { BittrexHttp } from '../../../BittrexHttp'
import { IBittrexKeySchema } from '../../../schemas/IBittrexKeySchema'



const log = debug('@alunajs:bittrex/key/parseDetails')



export const parseDetails = (exchange: IAlunaExchangeAuthed) => (
  params: IAlunaKeyParseDetailsParams<IBittrexKeySchema>,
): IAlunaKeyParseDetailsReturns => {

  log('parsing Bittrex key details')

  const {
    rawKey,
    http = new BittrexHttp(),
  } = params

  const { accountId } = rawKey

  const { key: permissions } = exchange.key.parsePermissions({ rawKey })

  const key: IAlunaKeySchema = {
    accountId,
    permissions,
    meta: rawKey,
  }

  const { requestCount } = http

  return {
    key,
    requestCount,
  }

}
