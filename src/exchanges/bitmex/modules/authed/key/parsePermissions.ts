import { debug } from 'debug'

import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaKeyParsePermissionsParams,
  IAlunaKeyParsePermissionsReturns,
} from '../../../../../lib/modules/authed/IAlunaKeyModule'
import { IAlunaKeyPermissionSchema } from '../../../../../lib/schemas/IAlunaKeySchema'
import { IBitmexKeySchema } from '../../../schemas/IBitmexKeySchema'



const log = debug('@alunajs:bitmex/key/parsePermissions')



export const parsePermissions = (exchange: IAlunaExchangeAuthed) => (
  params: IAlunaKeyParsePermissionsParams<IBitmexKeySchema>,
): IAlunaKeyParsePermissionsReturns => {

  log('parsing Bitmex key permissions', params)

  const { rawKey } = params

  const permissions: IAlunaKeyPermissionSchema = {
    read: rawKey.read,
    trade: rawKey.trade,
    withdraw: rawKey.withdraw,
  }

  return { permissions }

}
