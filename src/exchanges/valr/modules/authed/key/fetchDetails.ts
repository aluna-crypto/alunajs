import { debug } from 'debug'

import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import { AlunaHttpVerbEnum } from '../../../../../lib/enums/AlunaHtttpVerbEnum'
import {
  IAlunaKeyFetchDetailsParams,
  IAlunaKeyFetchDetailsReturns,
} from '../../../../../lib/modules/authed/IAlunaKeyModule'
import { IValrKeySchema } from '../../../schemas/IValrKeySchema'
import { ValrHttp } from '../../../ValrHttp'
import { getValrEndpoints } from '../../../valrSpecs'



const log = debug('alunajs:valr/key/fetchDetails')



export const fetchDetails = (exchange: IAlunaExchangeAuthed) => async (
  params: IAlunaKeyFetchDetailsParams = {},
): Promise<IAlunaKeyFetchDetailsReturns> => {

  log('fetching Valr key permissions')

  const {
    settings,
    credentials,
  } = exchange

  const { http = new ValrHttp(settings) } = params

  const permissions = await http.authedRequest<IValrKeySchema>({
    verb: AlunaHttpVerbEnum.GET,
    url: getValrEndpoints(settings).key.fetchDetails,
    credentials,
  })

  const { key } = exchange.key.parseDetails({ rawKey: permissions })

  const { requestWeight } = http

  return {
    key,
    requestWeight,
  }

}
