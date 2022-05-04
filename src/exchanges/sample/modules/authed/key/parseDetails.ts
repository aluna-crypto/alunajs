import { debug } from 'debug'

import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaKeyParseDetailsParams,
  IAlunaKeyParseDetailsReturns,
} from '../../../../../lib/modules/authed/IAlunaKeyModule'
import { IAlunaKeySchema } from '../../../../../lib/schemas/IAlunaKeySchema'
import { SampleHttp } from '../../../SampleHttp'
import { ISampleKeySchema } from '../../../schemas/ISampleKeySchema'



const log = debug('@alunajs:sample/key/parseDetails')



export const parseDetails = (exchange: IAlunaExchangeAuthed) => async (
  params: IAlunaKeyParseDetailsParams<ISampleKeySchema>,
): Promise<IAlunaKeyParseDetailsReturns> => {

  log('parsing Sample key details')

  const {
    rawKey,
    http = new SampleHttp(),
  } = params

  const { accountId } = rawKey

  const { key: permissions } = await exchange.key.parsePermissions({ rawKey })

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
