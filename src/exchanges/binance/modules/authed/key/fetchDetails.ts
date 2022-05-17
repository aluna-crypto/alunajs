import { debug } from 'debug'

import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import { AlunaHttpVerbEnum } from '../../../../../lib/enums/AlunaHtttpVerbEnum'
import {
  IAlunaKeyFetchDetailsParams,
  IAlunaKeyFetchDetailsReturns,
} from '../../../../../lib/modules/authed/IAlunaKeyModule'
import { BinanceHttp } from '../../../BinanceHttp'
import { getBinanceEndpoints } from '../../../binanceSpecs'
import { IBinanceKeySchema } from '../../../schemas/IBinanceKeySchema'



const log = debug('alunajs:binance/key/fetchDetails')



export const fetchDetails = (exchange: IAlunaExchangeAuthed) => async (
  params: IAlunaKeyFetchDetailsParams = {},
): Promise<IAlunaKeyFetchDetailsReturns> => {

  log('fetching Binance key permissions')

  const {
    settings,
    credentials,
  } = exchange

  const { http = new BinanceHttp(settings) } = params

  const permissions = await http.authedRequest<IBinanceKeySchema>({
    verb: AlunaHttpVerbEnum.GET,
    url: getBinanceEndpoints(settings).key.fetchDetails,
    credentials,
  })

  const { key } = exchange.key.parseDetails({ rawKey: permissions })

  const { requestWeight } = http

  return {
    key,
    requestWeight,
  }

}
