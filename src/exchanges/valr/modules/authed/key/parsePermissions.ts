import { debug } from 'debug'

import { forEach } from 'lodash'
import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaKeyParsePermissionsParams,
  IAlunaKeyParsePermissionsReturns,
} from '../../../../../lib/modules/authed/IAlunaKeyModule'
import { IAlunaKeyPermissionSchema } from '../../../../../lib/schemas/IAlunaKeySchema'
import { ValrHttp } from '../../../ValrHttp'
import { IValrKeySchema, ValrApiKeyPermissionsEnum } from '../../../schemas/IValrKeySchema'



const log = debug('@alunajs:valr/key/parsePermissions')



export const parsePermissions = (exchange: IAlunaExchangeAuthed) => (
  params: IAlunaKeyParsePermissionsParams<IValrKeySchema>,
): IAlunaKeyParsePermissionsReturns => {

  log('parsing Valr key permissions', params)

  const {
    rawKey,
    http = new ValrHttp(),
  } = params

  const {
    permissions,
  } = rawKey

  const key: IAlunaKeyPermissionSchema = {
    read: false,
    trade: false,
    withdraw: false,
  }

  forEach(permissions, (permission) => {

    switch (permission) {

      case ValrApiKeyPermissionsEnum.VIEW_ACCESS:
        key.read = true
        break

      case ValrApiKeyPermissionsEnum.TRADE:
        key.trade = true
        break

      case ValrApiKeyPermissionsEnum.WITHDRAW:
        key.withdraw = true
        break

      default:

        log(`Unknown permission '${permission}' found on Valr `
          .concat('permissions API response'))

    }

  })

  const { requestCount } = http

  return {
    key,
    requestCount,
  }

}
