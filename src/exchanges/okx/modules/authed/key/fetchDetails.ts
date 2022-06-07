import { debug } from 'debug'

import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import { AlunaHttpVerbEnum } from '../../../../../lib/enums/AlunaHtttpVerbEnum'
import {
  IAlunaKeyFetchDetailsParams,
  IAlunaKeyFetchDetailsReturns,
} from '../../../../../lib/modules/authed/IAlunaKeyModule'
import { OkxHttp } from '../../../OkxHttp'
import { getOkxEndpoints } from '../../../okxSpecs'
import {
  IOkxKeyAccountSchema,
  IOkxKeySchema,
} from '../../../schemas/IOkxKeySchema'



const log = debug('alunajs:okx/key/fetchDetails')



export const fetchDetails = (exchange: IAlunaExchangeAuthed) => async (
  params: IAlunaKeyFetchDetailsParams = {},
): Promise<IAlunaKeyFetchDetailsReturns> => {

  log('fetching Okx key permissions')

  const {
    settings,
    credentials,
  } = exchange

  const { http = new OkxHttp(settings) } = params

  const rawKey: IOkxKeySchema = {
    read: false,
    trade: false,
    withdraw: false,
    accountId: undefined,
  }


  const [
    accountConfig,
  ] = await http.authedRequest<IOkxKeyAccountSchema[]>({
    verb: AlunaHttpVerbEnum.GET,
    url: getOkxEndpoints(settings).key.fetchDetails,
    credentials,
  })

  rawKey.read = true
  rawKey.accountId = accountConfig.uid

  try {

    // Since OKX does not have a request to get API keys permissions, we
    // execute a request to place an order with invalid body params to force
    // the exchange validates if the API key has permission to trade
    await http.authedRequest({
      url: getOkxEndpoints(settings).order.place,
      credentials,
      body: {},
    })

  } catch (err) {

    const { metadata } = err

    const INVALID_AUTHORIZATION = '50114'
    const EMPTY_REQUIRED_PARAMETER = '50014'

    // If the error is related to required parameters, it means OKX already
    // ensured the given user API key has permission to trade
    if (metadata.sCode === EMPTY_REQUIRED_PARAMETER) {

      rawKey.trade = true

    } else if (metadata.sCode !== INVALID_AUTHORIZATION) {

      throw err

    }

  }

  const { key } = exchange.key.parseDetails({ rawKey })

  const { requestWeight } = http

  return {
    key,
    requestWeight,
  }

}
