import { IAlunaExchangeAuthed } from '../../../../lib/core/IAlunaExchange'
import { IAlunaKeyModule } from '../../../../lib/modules/authed/IAlunaKeyModule'
import { fetchDetails } from './key/fetchDetails'
import { parseDetails } from './key/parseDetails'
import { parsePermissions } from './key/parsePermissions'



export function key (parent: IAlunaExchangeAuthed): IAlunaKeyModule {

  return {
    fetchDetails: fetchDetails(parent),
    parseDetails: parseDetails(parent),
    parsePermissions: parsePermissions(parent),
  }

}
