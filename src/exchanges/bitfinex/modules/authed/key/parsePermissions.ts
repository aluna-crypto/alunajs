import { debug } from 'debug'

import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaKeyParsePermissionsParams,
  IAlunaKeyParsePermissionsReturns,
} from '../../../../../lib/modules/authed/IAlunaKeyModule'
import { IAlunaKeyPermissionSchema } from '../../../../../lib/schemas/IAlunaKeySchema'
import { IBitfinexKeySchema } from '../../../schemas/IBitfinexKeySchema'



const log = debug('alunajs:bitfinex/key/parsePermissions')



export const parsePermissions = (exchange: IAlunaExchangeAuthed) => (
  params: IAlunaKeyParsePermissionsParams<IBitfinexKeySchema>,
): IAlunaKeyParsePermissionsReturns => {

  log('parsing Bitfinex key permissions', params)

  const { rawKey } = params

  const { permissionsScope } = rawKey

  const [
    _accountScope,
    ordersScope,
    _fundingScope,
    _settingsScope,
    walletsScope,
    withdrawScope,
  ] = permissionsScope

  const canReadBalances = walletsScope[1] === 1

  const canReadOrders = ordersScope[1] === 1

  const canCreateOrders = ordersScope[2] === 1

  const canWithdraw = withdrawScope[2] === 1

  const permissions: IAlunaKeyPermissionSchema = {
    read: canReadBalances && canReadOrders,
    trade: canCreateOrders,
    withdraw: canWithdraw,
  }

  return { permissions }

}
