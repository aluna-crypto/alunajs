import { debug } from 'debug'
import { forEach } from 'lodash'

import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaKeyParsePermissionsParams,
  IAlunaKeyParsePermissionsReturns,
} from '../../../../../lib/modules/authed/IAlunaKeyModule'
import { IAlunaKeyPermissionSchema } from '../../../../../lib/schemas/IAlunaKeySchema'
import { IHuobiRawKeySchema } from '../../../schemas/IHuobiKeySchema'



const log = debug('alunajs:huobi/key/parsePermissions')



export const parsePermissions = (exchange: IAlunaExchangeAuthed) => (
  params: IAlunaKeyParsePermissionsParams<IHuobiRawKeySchema>,
): IAlunaKeyParsePermissionsReturns => {

  log('parsing Huobi key permissions', params)

  const { rawKey } = params

  const { permission: rawPermissions } = rawKey

  const permissions: IAlunaKeyPermissionSchema = {
    read: false,
    trade: false,
    withdraw: false,
  }

  forEach(rawPermissions.split(','), (permission: string) => {

    switch (permission) {

      case 'withdraw':
        permissions.withdraw = true
        break

      case 'readOnly':
        permissions.read = true
        break

      case 'trade':
        permissions.trade = true
        break

      default:

        log(`Unknown permission '${permission}' found on Huobi `
          .concat('permissions API response'))
        break

    }

  })

  return { permissions }

}
