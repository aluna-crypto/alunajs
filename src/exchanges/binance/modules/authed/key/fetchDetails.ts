import { debug } from 'debug'

import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import { AlunaHttpVerbEnum } from '../../../../../lib/enums/AlunaHtttpVerbEnum'
import {
  IAlunaKeyFetchDetailsParams,
  IAlunaKeyFetchDetailsReturns,
} from '../../../../../lib/modules/authed/IAlunaKeyModule'
import { binanceHttp } from '../../../binanceHttp'
import { getbinanceEndpoints } from '../../../binanceSpecs'
import { IbinanceKeySchema } from '../../../schemas/IbinanceKeySchema'



const log = debug('@alunajs:binance/key/fetchDetails')



export const fetchDetails = (exchange: IAlunaExchangeAuthed) => async (
  params: IAlunaKeyFetchDetailsParams = {},
): Promise<IAlunaKeyFetchDetailsReturns> => {

  log('fetching binance key permissions')

  const {
    settings,
    credentials,
  } = exchange

  const { http = new binanceHttp(settings) } = params

  // TODO: Implement proper request
  const permissions = await http.authedRequest<IbinanceKeySchema>({
    verb: AlunaHttpVerbEnum.GET,
    url: getbinanceEndpoints(settings).key.fetchDetails,
    credentials,
  })

  const { key } = exchange.key.parseDetails({ rawKey: permissions })

  const { requestCount } = http

  return {
    key,
    requestCount,
  }

}
