import { debug } from 'debug'

import { forEach } from 'lodash'
import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaKeyParsePermissionsParams,
  IAlunaKeyParsePermissionsReturns,
} from '../../../../../lib/modules/authed/IAlunaKeyModule'
import { IAlunaKeyPermissionSchema } from '../../../../../lib/schemas/IAlunaKeySchema'
import { IValrKeySchema, ValrApiKeyPermissionsEnum } from '../../../schemas/IValrKeySchema'



const log = debug('@alunajs:valr/key/parsePermissions')



export const parsePermissions = (exchange: IAlunaExchangeAuthed) => (
  params: IAlunaKeyParsePermissionsParams<IValrKeySchema>,
): IAlunaKeyParsePermissionsReturns => {

  log('parsing Valr key permissions', params)

  const { rawKey } = params

  const { permissions: rawPermissions } = rawKey

  const permissions: IAlunaKeyPermissionSchema = {
    read: false,
    trade: false,
    withdraw: false,
  }

  forEach(rawPermissions, (permission) => {

    switch (permission) {

      case ValrApiKeyPermissionsEnum.VIEW_ACCESS:
        permissions.read = true
        break

      case ValrApiKeyPermissionsEnum.TRADE:
        permissions.trade = true
        break

      case ValrApiKeyPermissionsEnum.WITHDRAW:
        permissions.withdraw = true
        break

      default:

        log(`Unknown permission '${permission}' found on Valr `
          .concat('permissions API response'))

    }

  })

  return { permissions }

}
