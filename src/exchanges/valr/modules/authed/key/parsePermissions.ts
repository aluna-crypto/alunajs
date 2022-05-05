import { debug } from 'debug'

import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaKeyParsePermissionsParams,
  IAlunaKeyParsePermissionsReturns,
} from '../../../../../lib/modules/authed/IAlunaKeyModule'
import { IAlunaKeyPermissionSchema } from '../../../../../lib/schemas/IAlunaKeySchema'
import { ValrHttp } from '../../../ValrHttp'
import { IValrKeySchema } from '../../../schemas/IValrKeySchema'



const log = debug('@alunajs:valr/key/parsePermissions')



export const parsePermissions = (exchange: IAlunaExchangeAuthed) => (
  params: IAlunaKeyParsePermissionsParams<IValrKeySchema>,
): IAlunaKeyParsePermissionsReturns => {

  log('parsing Valr key permissions', params)

  const {
    rawKey,
    http = new ValrHttp(),
  } = params

  const key: IAlunaKeyPermissionSchema = {
    read: rawKey.read,
    trade: rawKey.trade,
    withdraw: rawKey.withdraw,
  }

  const { requestCount } = http

  return {
    key,
    requestCount,
  }

}
