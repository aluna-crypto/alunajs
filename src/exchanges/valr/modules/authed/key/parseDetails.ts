import { debug } from 'debug'

import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaKeyParseDetailsParams,
  IAlunaKeyParseDetailsReturns,
} from '../../../../../lib/modules/authed/IAlunaKeyModule'
import { IAlunaKeySchema } from '../../../../../lib/schemas/IAlunaKeySchema'
import { ValrHttp } from '../../../ValrHttp'
import { IValrKeySchema } from '../../../schemas/IValrKeySchema'



const log = debug('@alunajs:valr/key/parseDetails')



export const parseDetails = (exchange: IAlunaExchangeAuthed) => (
  params: IAlunaKeyParseDetailsParams<IValrKeySchema>,
): IAlunaKeyParseDetailsReturns => {

  log('parsing Valr key details')

  const {
    rawKey,
    http = new ValrHttp(),
  } = params

  const { key: permissions } = exchange.key.parsePermissions({ rawKey })

  const key: IAlunaKeySchema = {
    accountId: undefined, // valr doesn't have accountId
    permissions,
    meta: rawKey,
  }

  const { requestCount } = http

  return {
    key,
    requestCount,
  }

}
