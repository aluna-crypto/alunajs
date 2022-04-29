import { debug } from 'debug'

import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaKeyParsePermissionsParams,
  IAlunaKeyParsePermissionsReturns,
} from '../../../../../lib/modules/authed/IAlunaKeyModule'
import { IAlunaKeyPermissionSchema } from '../../../../../lib/schemas/IAlunaKeySchema'
import { BittrexHttp } from '../../../BittrexHttp'



const log = debug('@aluna.js:bittrex/key/parsePermissions')



export const parsePermissions = (exchange: IAlunaExchangeAuthed) => async (
  params: IAlunaKeyParsePermissionsParams<IBittrexKeySchema>,
): Promise<IAlunaKeyParsePermissionsReturns> => {

  log('params', params)

  const { http = new BittrexHttp() } = params

  const { rawKey } = params

  const key: IAlunaKeyPermissionSchema = {
    read: false,
    trade: false,
    withdraw: false,
  }

  delete rawKey.accountId

  Object.assign(key, rawKey)


  const { requestCount } = http

  return {
    key,
    requestCount,
  }

}
