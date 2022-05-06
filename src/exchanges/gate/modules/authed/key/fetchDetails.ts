import { debug } from 'debug'

import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import { AlunaHttpVerbEnum } from '../../../../../lib/enums/AlunaHtttpVerbEnum'
import {
  IAlunaKeyFetchDetailsParams,
  IAlunaKeyFetchDetailsReturns,
} from '../../../../../lib/modules/authed/IAlunaKeyModule'
import { GateHttp } from '../../../GateHttp'
import { gateEndpoints } from '../../../gateSpecs'
import { IGateKeySchema } from '../../../schemas/IGateKeySchema'



const log = debug('@alunajs:gate/key/fetchDetails')



export const fetchDetails = (exchange: IAlunaExchangeAuthed) => async (
  params: IAlunaKeyFetchDetailsParams = {},
): Promise<IAlunaKeyFetchDetailsReturns> => {

  log('fetching Gate key permissions')

  const { credentials } = exchange

  const { http = new GateHttp() } = params

  // TODO: Implement proper request
  const permissions = await http.authedRequest<IGateKeySchema>({
    verb: AlunaHttpVerbEnum.GET,
    url: gateEndpoints.key.fetchDetails,
    credentials,
  })

  const { key } = exchange.key.parseDetails({ rawKey: permissions })

  const { requestCount } = http

  return {
    key,
    requestCount,
  }

}
