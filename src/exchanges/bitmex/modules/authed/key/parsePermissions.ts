import { debug } from 'debug'
import { each } from 'lodash'

import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaKeyParsePermissionsParams,
  IAlunaKeyParsePermissionsReturns,
} from '../../../../../lib/modules/authed/IAlunaKeyModule'
import { IAlunaKeyPermissionSchema } from '../../../../../lib/schemas/IAlunaKeySchema'



const log = debug('alunajs:bitmex/key/parsePermissions')



export const parsePermissions = (exchange: IAlunaExchangeAuthed) => (
  params: IAlunaKeyParsePermissionsParams<string[]>,
): IAlunaKeyParsePermissionsReturns => {

  log('parsing Bitmex key permissions', params)

  const {
    rawKey: rawPermissions,
  } = params

  const permissions: IAlunaKeyPermissionSchema = {
    read: true,
    trade: false,
    withdraw: false,
  }

  each(rawPermissions, (permission) => {

    if (permission === 'order') {

      permissions.trade = true

    } else if (permission === 'withdraw') {

      permissions.withdraw = true

    }

  })

  return { permissions }

}
