import { debug } from 'debug'
import {
  assign,
  unset,
} from 'lodash'

import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaKeyParsePermissionsParams,
  IAlunaKeyParsePermissionsReturns,
} from '../../../../../lib/modules/authed/IAlunaKeyModule'
import { IAlunaKeyPermissionSchema } from '../../../../../lib/schemas/IAlunaKeySchema'
import { SampleHttp } from '../../../SampleHttp'
import { ISampleKeySchema } from '../../../schemas/ISampleKeySchema'



const log = debug('@aluna.js:sample/key/parsePermissions')



export const parsePermissions = (exchange: IAlunaExchangeAuthed) => async (
  params: IAlunaKeyParsePermissionsParams<ISampleKeySchema>,
): Promise<IAlunaKeyParsePermissionsReturns> => {

  log('parsing Sample key permissions', params)

  const {
    rawKey,
    http = new SampleHttp(),
  } = params

  const key: IAlunaKeyPermissionSchema = {
    read: false,
    trade: false,
    withdraw: false,
  }

  unset(rawKey, 'accountId')

  assign(key, rawKey)

  const { requestCount } = http

  return {
    key,
    requestCount,
  }

}
