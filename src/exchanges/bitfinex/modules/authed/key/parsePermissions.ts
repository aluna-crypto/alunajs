import { debug } from 'debug'

import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaKeyParsePermissionsParams,
  IAlunaKeyParsePermissionsReturns,
} from '../../../../../lib/modules/authed/IAlunaKeyModule'
import { IAlunaKeyPermissionSchema } from '../../../../../lib/schemas/IAlunaKeySchema'
import { BitfinexHttp } from '../../../BitfinexHttp'
import { IBitfinexKeySchema } from '../../../schemas/IBitfinexKeySchema'



const log = debug('@alunajs:bitfinex/key/parsePermissions')



export const parsePermissions = (exchange: IAlunaExchangeAuthed) => (
  params: IAlunaKeyParsePermissionsParams<IBitfinexKeySchema>,
): IAlunaKeyParsePermissionsReturns => {

  log('parsing Bitfinex key permissions', params)

  const {
    rawKey,
    http = new BitfinexHttp(),
  } = params

  const key: IAlunaKeyPermissionSchema = {
    read: rawKey.read,
    trade: rawKey.trade,
    withdraw: rawKey.withdraw,
  }

  const { requestCount } = http

  return {
    key,
    requestCount,
  }

}
