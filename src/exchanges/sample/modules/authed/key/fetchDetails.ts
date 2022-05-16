import { debug } from 'debug'

import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import { AlunaHttpVerbEnum } from '../../../../../lib/enums/AlunaHtttpVerbEnum'
import {
  IAlunaKeyFetchDetailsParams,
  IAlunaKeyFetchDetailsReturns,
} from '../../../../../lib/modules/authed/IAlunaKeyModule'
import { SampleHttp } from '../../../SampleHttp'
import { getSampleEndpoints } from '../../../sampleSpecs'
import { ISampleKeySchema } from '../../../schemas/ISampleKeySchema'



const log = debug('alunajs:sample/key/fetchDetails')



export const fetchDetails = (exchange: IAlunaExchangeAuthed) => async (
  params: IAlunaKeyFetchDetailsParams = {},
): Promise<IAlunaKeyFetchDetailsReturns> => {

  log('fetching Sample key permissions')

  const {
    settings,
    credentials,
  } = exchange

  const { http = new SampleHttp(settings) } = params

  // TODO: Implement proper request
  const rawKey = await http.authedRequest<ISampleKeySchema>({
    verb: AlunaHttpVerbEnum.GET,
    url: getSampleEndpoints(settings).key.fetchDetails,
    credentials,
  })

  const { key } = exchange.key.parseDetails({ rawKey })

  const { requestWeight } = http

  return {
    key,
    requestWeight,
  }

}
