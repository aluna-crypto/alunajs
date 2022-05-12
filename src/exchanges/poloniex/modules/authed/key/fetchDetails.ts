import { debug } from 'debug'

import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import { AlunaHttpVerbEnum } from '../../../../../lib/enums/AlunaHtttpVerbEnum'
import {
  IAlunaKeyFetchDetailsParams,
  IAlunaKeyFetchDetailsReturns,
} from '../../../../../lib/modules/authed/IAlunaKeyModule'
import { PoloniexHttp } from '../../../PoloniexHttp'
import { getPoloniexEndpoints } from '../../../poloniexSpecs'
import { IPoloniexKeySchema } from '../../../schemas/IPoloniexKeySchema'



const log = debug('@alunajs:poloniex/key/fetchDetails')



export const fetchDetails = (exchange: IAlunaExchangeAuthed) => async (
  params: IAlunaKeyFetchDetailsParams = {},
): Promise<IAlunaKeyFetchDetailsReturns> => {

  log('fetching Poloniex key permissions')

  const {
    settings,
    credentials,
  } = exchange

  const { http = new PoloniexHttp(settings) } = params

  // TODO: Implement proper request
  const rawKey = await http.authedRequest<IPoloniexKeySchema>({
    verb: AlunaHttpVerbEnum.GET,
    url: getPoloniexEndpoints(settings).key.fetchDetails,
    credentials,
  })

  const { key } = exchange.key.parseDetails({ rawKey })

  const { requestWeight } = http

  return {
    key,
    requestWeight,
  }

}
