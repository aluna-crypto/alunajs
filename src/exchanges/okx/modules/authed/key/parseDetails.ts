import { debug } from 'debug'

import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaKeyParseDetailsParams,
  IAlunaKeyParseDetailsReturns,
} from '../../../../../lib/modules/authed/IAlunaKeyModule'
import { IAlunaKeySchema } from '../../../../../lib/schemas/IAlunaKeySchema'
import { IOkxKeySchema } from '../../../schemas/IOkxKeySchema'



const log = debug('alunajs:okx/key/parseDetails')



export const parseDetails = (exchange: IAlunaExchangeAuthed) => (
  params: IAlunaKeyParseDetailsParams<IOkxKeySchema>,
): IAlunaKeyParseDetailsReturns => {

  log('parsing Okx key details')

  const { rawKey } = params

  const { accountId } = rawKey

  const { permissions } = exchange.key.parsePermissions({ rawKey })

  const key: IAlunaKeySchema = {
    accountId,
    permissions,
    meta: rawKey,
  }

  return { key }

}
