import { debug } from 'debug'
import {
  assign,
  unset,
} from 'lodash'

import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaKeyParsePermissionsParams,
  IAlunaKeyParsePermissionsReturns,
} from '../../../../../lib/modules/authed/IAlunaKeyModule'
import { IAlunaKeyPermissionSchema } from '../../../../../lib/schemas/IAlunaKeySchema'
import { IBittrexKeySchema } from '../../../schemas/IBittrexKeySchema'



const log = debug('@alunajs:bittrex/key/parsePermissions')



export const parsePermissions = (exchange: IAlunaExchangeAuthed) => (
  params: IAlunaKeyParsePermissionsParams<IBittrexKeySchema>,
): IAlunaKeyParsePermissionsReturns => {

  log('parsing Bittrex key permissions', params)

  const { rawKey } = params

  const permissions: IAlunaKeyPermissionSchema = {
    read: false,
    trade: false,
    withdraw: false,
  }

  unset(rawKey, 'accountId')

  assign(permissions, rawKey)


  return { permissions }

}
