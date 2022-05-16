import { debug } from 'debug'

import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaKeyParseDetailsParams,
  IAlunaKeyParseDetailsReturns,
} from '../../../../../lib/modules/authed/IAlunaKeyModule'
import { IAlunaKeySchema } from '../../../../../lib/schemas/IAlunaKeySchema'
import { IBinanceKeySchema } from '../../../schemas/IBinanceKeySchema'



const log = debug('alunajs:binance/key/parseDetails')



export const parseDetails = (exchange: IAlunaExchangeAuthed) => (
  params: IAlunaKeyParseDetailsParams<IBinanceKeySchema>,
): IAlunaKeyParseDetailsReturns => {

  log('parsing Binance key details')

  const { rawKey } = params

  const { permissions } = exchange.key.parsePermissions({ rawKey })

  const key: IAlunaKeySchema = {
    accountId: undefined, //  binance doesn't give this
    permissions,
    meta: rawKey,
  }

  return { key }

}
