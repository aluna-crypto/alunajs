import { debug } from 'debug'

import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaKeyParseDetailsParams,
  IAlunaKeyParseDetailsReturns,
} from '../../../../../lib/modules/authed/IAlunaKeyModule'
import { IAlunaKeySchema } from '../../../../../lib/schemas/IAlunaKeySchema'
import { BittrexHttp } from '../../../BittrexHttp'
import { IBittrexKeySchema } from '../../../schemas/IBittrexKeySchema'
import { parsePermissions } from './parsePermissions'



const log = debug('@aluna.js:bittrex/key/parseDetails')



export const parseDetails = (exchange: IAlunaExchangeAuthed) => async (
  params: IAlunaKeyParseDetailsParams<IBittrexKeySchema>,
): Promise<IAlunaKeyParseDetailsReturns> => {

  log('parsing Bittrex key details')

  const {
    rawKey,
    http = new BittrexHttp(),
  } = params

  const { accountId } = rawKey

  const {
    key: parsedPermissions,
  } = await parsePermissions(exchange)({ rawKey })

  const key: IAlunaKeySchema = {
    accountId,
    permissions: parsedPermissions,
    meta: rawKey,
  }

  const { requestCount } = http

  return {
    key,
    requestCount,
  }

}
