import { debug } from 'debug'

import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import { AlunaHttpVerbEnum } from '../../../../../lib/enums/AlunaHtttpVerbEnum'
import {
  IAlunaKeyFetchDetailsParams,
  IAlunaKeyFetchDetailsReturns,
} from '../../../../../lib/modules/authed/IAlunaKeyModule'
import { OkxHttp } from '../../../OkxHttp'
import { getOkxEndpoints } from '../../../okxSpecs'
import { IOkxKeyAccountSchema, IOkxKeySchema } from '../../../schemas/IOkxKeySchema'



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

  const INVALID_PERMISSION_CODE = '50030'
  const INVALID_PARAM_CODE = '51116'

  const rawKey: IOkxKeySchema = {
    read: false,
    trade: false,
    withdraw: false,
    accountId: undefined,
  }

  try {

    const [
      accountConfig,
    ] = await http.authedRequest<IOkxKeyAccountSchema[]>({
      verb: AlunaHttpVerbEnum.GET,
      url: getOkxEndpoints(settings).key.fetchDetails,
      credentials,
    })

    rawKey.read = true
    rawKey.accountId = accountConfig.uid

  } catch (err) {

    if (err.metadata?.code === INVALID_PERMISSION_CODE) {

      rawKey.read = false

    } else {

      throw err

    }

  }

  const requestBody = {
    instId: 'BTC-USDT',
    tdMode: 'cash',
    side: 'buy',
    ordType: 'limit',
    sz: '1',
    px: '123123123123123',
  }

  const [order] = await http.authedRequest<{ sCode: string }[]>({
    url: getOkxEndpoints(settings).order.place,
    credentials,
    body: requestBody,
  })

  if (order.sCode === INVALID_PARAM_CODE) {

    rawKey.trade = true

  }

  const { key } = exchange.key.parseDetails({ rawKey })

  const { requestWeight } = http

  return {
    key,
    requestWeight,
  }

}
