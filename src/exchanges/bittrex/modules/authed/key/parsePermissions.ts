import { debug } from 'debug'

import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaKeyParsePermissionsParams,
  IAlunaKeyParsePermissionsReturns,
} from '../../../../../lib/modules/authed/IAlunaKeyModule'
import { IAlunaKeyPermissionSchema } from '../../../../../lib/schemas/IAlunaKeySchema'
import { BittrexHttp } from '../../../BittrexHttp'
import { IBittrexKeySchema } from '../../../schemas/IBittrexKeySchema'



const log = debug('@aluna.js:bittrex/key/parsePermissions')



export const parsePermissions = (exchange: IAlunaExchangeAuthed) => async (
  params: IAlunaKeyParsePermissionsParams<IBittrexKeySchema>,
): Promise<IAlunaKeyParsePermissionsReturns> => {

  log('parsing Bittrex key permissions', params)

  const { http = new BittrexHttp() } = params

  const { rawKey } = params

  const key: IAlunaKeyPermissionSchema = {
    read: false,
    trade: false,
    withdraw: false,
  }

  // TODO: Add `accountId` to `IAlunaKeySchema`
  delete rawKey.accountId

  Object.assign(key, rawKey)

  const { requestCount } = http

  return {
    key,
    requestCount,
  }

}
