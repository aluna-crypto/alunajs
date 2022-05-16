import { debug } from 'debug'

import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import { AlunaHttpVerbEnum } from '../../../../../lib/enums/AlunaHtttpVerbEnum'
import {
  IAlunaKeyFetchDetailsParams,
  IAlunaKeyFetchDetailsReturns,
} from '../../../../../lib/modules/authed/IAlunaKeyModule'
import { GateOrderSideEnum } from '../../../enums/GateOrderSideEnum'
import { GateHttp } from '../../../GateHttp'
import { getGateEndpoints } from '../../../gateSpecs'
import {
  IGateKeyAccountResponseSchema,
  IGateKeySchema,
} from '../../../schemas/IGateKeySchema'



const log = debug('alunajs:gate/key/fetchDetails')



export const fetchDetails = (exchange: IAlunaExchangeAuthed) => async (
  params: IAlunaKeyFetchDetailsParams = {},
): Promise<IAlunaKeyFetchDetailsReturns> => {

  log('fetching Gate key permissions')

  const {
    settings,
    credentials,
  } = exchange

  const FORBIDDEN_MESSAGE = 'FORBIDDEN'
  const READ_ONLY_MESSAGE = 'READ_ONLY'
  const INVALID_CURRENCY_PAIR_MESSAGE = 'INVALID_CURRENCY_PAIR'

  const { http = new GateHttp(settings) } = params

  const rawKey: IGateKeySchema = {
    read: false,
    trade: false,
    withdraw: false,
    accountId: undefined,
  }

  try {

    const account = await http.authedRequest<IGateKeyAccountResponseSchema>({
      verb: AlunaHttpVerbEnum.GET,
      url: getGateEndpoints(settings).key.fetchDetails,
      credentials,
    })

    rawKey.read = true
    rawKey.accountId = account.user_id.toString()

  } catch (err) {

    const {
      metadata,
    } = err

    if (metadata.label === FORBIDDEN_MESSAGE) {

      rawKey.read = false

    } else {

      throw err

    }

  }

  try {

    const requestBody = {
      currency_pair: 'BTCUSDT',
      side: GateOrderSideEnum.BUY,
      amount: '0',
      price: '0',
    }


    await http.authedRequest<any>({
      verb: AlunaHttpVerbEnum.POST,
      url: getGateEndpoints(settings).order.place,
      credentials,
      body: requestBody,
    })

  } catch (err) {

    const {
      metadata,
    } = err

    if (metadata.label === FORBIDDEN_MESSAGE) {

      rawKey.trade = false

    } else if (metadata.label === READ_ONLY_MESSAGE) {

      rawKey.trade = false

    } else if (metadata.label === INVALID_CURRENCY_PAIR_MESSAGE) {

      rawKey.trade = true

    } else {

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
