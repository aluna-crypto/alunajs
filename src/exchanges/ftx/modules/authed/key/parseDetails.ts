import { debug } from 'debug'

import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaKeyParseDetailsParams,
  IAlunaKeyParseDetailsReturns,
} from '../../../../../lib/modules/authed/IAlunaKeyModule'
import { IAlunaKeySchema } from '../../../../../lib/schemas/IAlunaKeySchema'
import { IFtxKeySchema } from '../../../schemas/IFtxKeySchema'



const log = debug('alunajs:ftx/key/parseDetails')



export const parseDetails = (exchange: IAlunaExchangeAuthed) => (
  params: IAlunaKeyParseDetailsParams<IFtxKeySchema>,
): IAlunaKeyParseDetailsReturns => {

  log('parsing Ftx key details')

  const { rawKey } = params

  const { account } = rawKey

  const { accountIdentifier } = account

  const { permissions } = exchange.key.parsePermissions({ rawKey })

  const key: IAlunaKeySchema = {
    accountId: accountIdentifier.toString(),
    permissions,
    meta: rawKey,
  }

  return { key }

}
