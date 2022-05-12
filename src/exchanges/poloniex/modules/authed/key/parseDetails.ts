import { debug } from 'debug'

import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaKeyParseDetailsParams,
  IAlunaKeyParseDetailsReturns,
} from '../../../../../lib/modules/authed/IAlunaKeyModule'
import { IAlunaKeySchema } from '../../../../../lib/schemas/IAlunaKeySchema'
import { IPoloniexKeySchema } from '../../../schemas/IPoloniexKeySchema'



const log = debug('@alunajs:poloniex/key/parseDetails')



export const parseDetails = (exchange: IAlunaExchangeAuthed) => (
  params: IAlunaKeyParseDetailsParams<IPoloniexKeySchema>,
): IAlunaKeyParseDetailsReturns => {

  log('parsing Poloniex key details')

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
