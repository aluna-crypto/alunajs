import { debug } from 'debug'

import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import { AlunaHttpVerbEnum } from '../../../../../lib/enums/AlunaHtttpVerbEnum'
import {
  IAlunaKeyFetchDetailsParams,
  IAlunaKeyFetchDetailsReturns,
} from '../../../../../lib/modules/authed/IAlunaKeyModule'
import { ValrHttp } from '../../../ValrHttp'
import { valrEndpoints } from '../../../valrSpecs'
import { IValrKeySchema } from '../../../schemas/IValrKeySchema'



const log = debug('@alunajs:valr/key/fetchDetails')



export const fetchDetails = (exchange: IAlunaExchangeAuthed) => async (
  params: IAlunaKeyFetchDetailsParams = {},
): Promise<IAlunaKeyFetchDetailsReturns> => {

  log('fetching Valr key permissions')

  const { credentials } = exchange

  const { http = new ValrHttp() } = params

  // TODO: Implement proper request
  const permissions = await http.authedRequest<IValrKeySchema>({
    verb: AlunaHttpVerbEnum.GET,
    url: valrEndpoints.key.fetchDetails,
    credentials,
  })

  const { key } = exchange.key.parseDetails({ rawKey: permissions })

  const { requestCount } = http

  return {
    key,
    requestCount,
  }

}
