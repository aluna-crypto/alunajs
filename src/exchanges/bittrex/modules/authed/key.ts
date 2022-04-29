import { IAlunaExchangeAuthed } from '../../../../lib/core/IAlunaExchange'
import { IAlunaKeyModule } from '../../../../lib/modules/authed/IAlunaKeyModule'
import { fetchDetails } from './key/fetchDetails'
import { parseDetails } from './key/parseDetails'
import { parsePermissions } from './key/parsePermissions'



export function key(exchange: IAlunaExchangeAuthed): IAlunaKeyModule {

  return {
    fetchDetails: fetchDetails(exchange),
    parseDetails: parseDetails(exchange),
    parsePermissions: parsePermissions(exchange),
  }

}
