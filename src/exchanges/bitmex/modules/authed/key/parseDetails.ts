import { debug } from 'debug'
import {
  find,
  omit,
} from 'lodash'

import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaKeyParseDetailsParams,
  IAlunaKeyParseDetailsReturns,
} from '../../../../../lib/modules/authed/IAlunaKeyModule'
import { IAlunaKeySchema } from '../../../../../lib/schemas/IAlunaKeySchema'
import { IBitmexKeySchema } from '../../../schemas/IBitmexKeySchema'



const log = debug('alunajs:bitmex/key/parseDetails')



export const parseDetails = (exchange: IAlunaExchangeAuthed) => (
  params: IAlunaKeyParseDetailsParams<IBitmexKeySchema[]>,
): IAlunaKeyParseDetailsReturns => {

  log('parsing Bitmex key details')

  const { rawKey } = params

  const { credentials } = exchange

  const [{ userId }] = rawKey

  const singleKey = find(rawKey, { id: credentials.key })!

  const { permissions: rawPermissions } = singleKey

  const { permissions } = exchange.key.parsePermissions({
    rawKey: rawPermissions,
  })

  const key: IAlunaKeySchema = {
    accountId: userId.toString(),
    permissions,
    meta: omit(singleKey, 'secret', 'id'),
  }

  return { key }

}
