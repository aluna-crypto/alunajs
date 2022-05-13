import { debug } from 'debug'

import { AlunaError } from '../../../../../lib/core/AlunaError'
import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import { AlunaKeyErrorCodes } from '../../../../../lib/errors/AlunaKeyErrorCodes'
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

  const rawKey: IPoloniexKeySchema = {
    read: false,
  }

  try {

    const timestamp = new Date().getTime()
    const body = new URLSearchParams()

    body.append('command', 'returnOpenOrders')
    body.append('currencyPair', 'all')
    body.append('nonce', timestamp.toString())

    await http.authedRequest<IPoloniexKeySchema>({
      url: getPoloniexEndpoints(settings).key.fetchDetails,
      credentials,
      body,
    })

    rawKey.read = true

  } catch (err) {

    const {
      httpStatusCode,
      metadata,
    } = err

    const error = new AlunaError({
      code: AlunaKeyErrorCodes.INVALID,
      message: 'Invalid API key/secret pair.',
      httpStatusCode,
      metadata,
    })

    throw error

  }

  const { key } = exchange.key.parseDetails({ rawKey })

  const { requestWeight } = http

  return {
    key,
    requestWeight,
  }

}
