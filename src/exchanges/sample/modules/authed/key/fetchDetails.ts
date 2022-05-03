import { debug } from 'debug'

import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import { AlunaHttpVerbEnum } from '../../../../../lib/enums/AlunaHtttpVerbEnum'
import {
  IAlunaKeyFetchDetailsParams,
  IAlunaKeyFetchDetailsReturns,
} from '../../../../../lib/modules/authed/IAlunaKeyModule'
import { SampleHttp } from '../../../SampleHttp'
import { SAMPLE_PRODUCTION_URL } from '../../../sampleSpecs'
import { SampleOrderTimeInForceEnum } from '../../../enums/SampleOrderTimeInForceEnum'
import { SampleOrderTypeEnum } from '../../../enums/SampleOrderTypeEnum'
import { SampleSideEnum } from '../../../enums/SampleSideEnum'
import { ISampleBalanceSchema } from '../../../schemas/ISampleBalanceSchema'
import { ISampleKeySchema } from '../../../schemas/ISampleKeySchema'
import { parseDetails } from './parseDetails'



const log = debug('@aluna.js:sample/key/fetchDetails')



export const fetchDetails = (exchange: IAlunaExchangeAuthed) => async (
  params: IAlunaKeyFetchDetailsParams = {},
): Promise<IAlunaKeyFetchDetailsReturns> => {

  log('fetching Sample key permissions')

  const { credentials } = exchange
  const { http = new SampleHttp() } = params

  const INVALID_PERMISSION_MESSAGE = 'INVALID_PERMISSION'
  const BAD_REQUEST_MESSAGE = 'BAD_REQUEST'

  const permissions: ISampleKeySchema = {
    read: false,
    trade: false,
    withdraw: false,
  }

  try {

    await http.authedRequest<any>({
      verb: AlunaHttpVerbEnum.GET,
      url: `${SAMPLE_PRODUCTION_URL}/balances`,
      credentials,
    })

    permissions.read = true

  } catch (error) {

    if (error.metadata?.code === INVALID_PERMISSION_MESSAGE) {

      permissions.read = false

    } else {

      throw error

    }

  }

  try {

    const requestBody = {
      marketSymbol: 'BTCEUR',
      direction: SampleSideEnum.BUY,
      type: SampleOrderTypeEnum.MARKET,
      quantity: 0,
      timeInForce: SampleOrderTimeInForceEnum.GOOD_TIL_CANCELLED,
      useAwards: false,
    }

    await http.authedRequest<ISampleBalanceSchema>({
      verb: AlunaHttpVerbEnum.POST,
      url: `${SAMPLE_PRODUCTION_URL}/orders`,
      credentials,
      body: requestBody,
    })

  } catch (error) {

    if (error.metadata?.code === INVALID_PERMISSION_MESSAGE) {

      permissions.trade = false

    } else if (error.metadata?.code === BAD_REQUEST_MESSAGE) {

      permissions.trade = true

    } else {

      throw error

    }

  }

  try {

    const account = await http.authedRequest<ISampleKeySchema>({
      verb: AlunaHttpVerbEnum.GET,
      url: `${SAMPLE_PRODUCTION_URL}/account`,
      credentials,
    })


    permissions.accountId = account.accountId

  } catch (error) {

    log(error)

    throw error

  }

  const { key } = await parseDetails(exchange)({ rawKey: permissions })

  const { requestCount } = http

  return {
    key,
    requestCount,
  }

}
