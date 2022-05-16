import { debug } from 'debug'

import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaKeyParsePermissionsParams,
  IAlunaKeyParsePermissionsReturns,
} from '../../../../../lib/modules/authed/IAlunaKeyModule'
import { IAlunaKeyPermissionSchema } from '../../../../../lib/schemas/IAlunaKeySchema'
import { IPoloniexKeySchema } from '../../../schemas/IPoloniexKeySchema'



const log = debug('@alunajs:poloniex/key/parsePermissions')



export const parsePermissions = (exchange: IAlunaExchangeAuthed) => (
  params: IAlunaKeyParsePermissionsParams<IPoloniexKeySchema>,
): IAlunaKeyParsePermissionsReturns => {

  log('parsing Poloniex key permissions', params)

  const { rawKey } = params

  const { read } = rawKey

  const permissions: IAlunaKeyPermissionSchema = {
    read,
    trade: true,
    withdraw: false,
  }

  return { permissions }

}
