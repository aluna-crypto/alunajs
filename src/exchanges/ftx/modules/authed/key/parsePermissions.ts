import { debug } from 'debug'

import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaKeyParsePermissionsParams,
  IAlunaKeyParsePermissionsReturns,
} from '../../../../../lib/modules/authed/IAlunaKeyModule'
import { IAlunaKeyPermissionSchema } from '../../../../../lib/schemas/IAlunaKeySchema'
import { IFtxKeySchema } from '../../../schemas/IFtxKeySchema'



const log = debug('@alunajs:ftx/key/parsePermissions')



export const parsePermissions = (exchange: IAlunaExchangeAuthed) => (
  params: IAlunaKeyParsePermissionsParams<IFtxKeySchema>,
): IAlunaKeyParsePermissionsReturns => {

  log('parsing Ftx key permissions', params)

  const { rawKey } = params

  const { readOnly, withdrawalEnabled } = rawKey

  const permissions: IAlunaKeyPermissionSchema = {
    read: true,
    trade: false,
    withdraw: false,
  }

  if (!readOnly) {

    permissions.trade = true

  }

  if (withdrawalEnabled) {

    permissions.withdraw = true

  }

  return { permissions }

}
