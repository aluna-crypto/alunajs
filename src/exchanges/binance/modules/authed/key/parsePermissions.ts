import { debug } from 'debug'
import { forEach } from 'lodash'

import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaKeyParsePermissionsParams,
  IAlunaKeyParsePermissionsReturns,
} from '../../../../../lib/modules/authed/IAlunaKeyModule'
import { IAlunaKeyPermissionSchema } from '../../../../../lib/schemas/IAlunaKeySchema'
import { BinanceApiKeyPermissionsEnum } from '../../../enums/BinanceApiKeyPermissionsEnum'
import { IBinanceKeySchema } from '../../../schemas/IBinanceKeySchema'



const log = debug('alunajs:binance/key/parsePermissions')



export const parsePermissions = (exchange: IAlunaExchangeAuthed) => (
  params: IAlunaKeyParsePermissionsParams<IBinanceKeySchema>,
): IAlunaKeyParsePermissionsReturns => {

  log('parsing Binance key permissions', params)

  const { rawKey } = params

  const {
    permissions,
    canTrade,
    canWithdraw,
  } = rawKey

  const alunaPermissions: IAlunaKeyPermissionSchema = {
    read: false,
    trade: false,
    withdraw: false,
  }

  forEach(permissions, (permission) => {

    switch (permission) {

      case BinanceApiKeyPermissionsEnum.SPOT:
        alunaPermissions.read = true
        alunaPermissions.trade = canTrade
        alunaPermissions.withdraw = canWithdraw
        break

      default:

        log(`Unknown permission '${permission}' found on Binance`)
        break

    }

  })

  return { permissions: alunaPermissions }

}
