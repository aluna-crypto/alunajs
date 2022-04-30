import { debug } from 'debug'

import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaKeyParseDetailsParams,
  IAlunaKeyParseDetailsReturns,
} from '../../../../../lib/modules/authed/IAlunaKeyModule'
import { IAlunaKeySchema } from '../../../../../lib/schemas/IAlunaKeySchema'
import { BittrexHttp } from '../../../BittrexHttp'
import { parsePermissions } from './parsePermissions'



const log = debug('@aluna.js:bittrex/key/parseDetails')



export const parseDetails = (exchange: IAlunaExchangeAuthed) => async (
  params: IAlunaKeyParseDetailsParams,
): Promise<IAlunaKeyParseDetailsReturns> => {

  log('params', params)

  const { http = new BittrexHttp() } = params

  log('parsing Bittrex key details')

  const { rawKey } = params

  const { accountId } = rawKey

  const { key: permissions } = await parsePermissions(exchange)({ rawKey })

  const key: IAlunaKeySchema = {
    accountId,
    permissions,
    meta: rawKey,
  }

  const { requestCount } = http

  return {
    key,
    requestCount,
  }

}
