import { debug } from 'debug'

import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaKeyParsePermissionsParams,
  IAlunaKeyParsePermissionsReturns,
} from '../../../../../lib/modules/authed/IAlunaKeyModule'
import { IAlunaKeyPermissionSchema } from '../../../../../lib/schemas/IAlunaKeySchema'
import { IBinanceKeySchema } from '../../../schemas/IBinanceKeySchema'



const log = debug('@alunajs:binance/key/parsePermissions')



export const parsePermissions = (exchange: IAlunaExchangeAuthed) => (
  params: IAlunaKeyParsePermissionsParams<IBinanceKeySchema>,
): IAlunaKeyParsePermissionsReturns => {

  log('parsing Binance key permissions', params)

  const { rawKey } = params

  const permissions: IAlunaKeyPermissionSchema = {
    read: rawKey.read,
    trade: rawKey.trade,
    withdraw: rawKey.withdraw,
  }

  return { permissions }

}
