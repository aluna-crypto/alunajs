import { debug } from 'debug'

import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaKeyParseDetailsParams,
  IAlunaKeyParseDetailsReturns,
} from '../../../../../lib/modules/authed/IAlunaKeyModule'
import { IAlunaKeySchema } from '../../../../../lib/schemas/IAlunaKeySchema'
import { IHuobiRawKeySchema } from '../../../schemas/IHuobiKeySchema'



const log = debug('alunajs:huobi/key/parseDetails')



export const parseDetails = (exchange: IAlunaExchangeAuthed) => (
  params: IAlunaKeyParseDetailsParams<IHuobiRawKeySchema>,
): IAlunaKeyParseDetailsReturns => {

  log('parsing Huobi key details')

  const { rawKey } = params

  const { accountId } = rawKey

  const { permissions } = exchange.key.parsePermissions({ rawKey })

  const key: IAlunaKeySchema = {
    accountId: accountId.toString(),
    permissions,
    meta: rawKey,
  }

  return { key }

}
