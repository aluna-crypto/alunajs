import { debug } from 'debug'

import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaKeyParseDetailsParams,
  IAlunaKeyParseDetailsReturns,
} from '../../../../../lib/modules/authed/IAlunaKeyModule'
import { IAlunaKeySchema } from '../../../../../lib/schemas/IAlunaKeySchema'
import { IBitfinexKeySchema } from '../../../schemas/IBitfinexKeySchema'



const log = debug('@alunajs:bitfinex/key/parseDetails')



export const parseDetails = (exchange: IAlunaExchangeAuthed) => (
  params: IAlunaKeyParseDetailsParams<IBitfinexKeySchema>,
): IAlunaKeyParseDetailsReturns => {

  log('parsing Bitfinex key details')

  const { rawKey } = params

  const { permissions } = exchange.key.parsePermissions({ rawKey })

  const key: IAlunaKeySchema = {
    accountId: rawKey.accountId,
    permissions,
    meta: rawKey,
  }

  return { key }

}
