import { debug } from 'debug'

import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import { AlunaHttpVerbEnum } from '../../../../../lib/enums/AlunaHtttpVerbEnum'
import {
  IAlunaKeyFetchDetailsParams,
  IAlunaKeyFetchDetailsReturns,
} from '../../../../../lib/modules/authed/IAlunaKeyModule'
import { BittrexHttp } from '../../../BittrexHttp'
import { BITTREX_PRODUCTION_URL } from '../../../bittrexSpecs'
import { BittrexOrderTimeInForceEnum } from '../../../enums/BittrexOrderTimeInForceEnum'
import { BittrexOrderTypeEnum } from '../../../enums/BittrexOrderTypeEnum'
import { BittrexSideEnum } from '../../../enums/BittrexSideEnum'
import { IBittrexBalanceSchema } from '../../../schemas/IBittrexBalanceSchema'
import { IBittrexKeySchema } from '../../../schemas/IBittrexKeySchema'
import { parseDetails } from './parseDetails'



const log = debug('@alunajs:bittrex/key/fetchDetails')



export const fetchDetails = (exchange: IAlunaExchangeAuthed) => async (
  params: IAlunaKeyFetchDetailsParams = {},
): Promise<IAlunaKeyFetchDetailsReturns> => {

  log('fetching Bittrex key permissions')

  const { credentials } = exchange
  const { http = new BittrexHttp() } = params

  const INVALID_PERMISSION_MESSAGE = 'INVALID_PERMISSION'
  const BAD_REQUEST_MESSAGE = 'BAD_REQUEST'

  const permissions: IBittrexKeySchema = {
    read: false,
    trade: false,
    withdraw: false,
  }

  try {

    await http.authedRequest<any>({
      verb: AlunaHttpVerbEnum.GET,
      url: `${BITTREX_PRODUCTION_URL}/balances`,
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
      direction: BittrexSideEnum.BUY,
      type: BittrexOrderTypeEnum.MARKET,
      quantity: 0,
      timeInForce: BittrexOrderTimeInForceEnum.GOOD_TIL_CANCELLED,
      useAwards: false,
    }

    await http.authedRequest<IBittrexBalanceSchema>({
      verb: AlunaHttpVerbEnum.POST,
      url: `${BITTREX_PRODUCTION_URL}/orders`,
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

    const account = await http.authedRequest<IBittrexKeySchema>({
      verb: AlunaHttpVerbEnum.GET,
      url: `${BITTREX_PRODUCTION_URL}/account`,
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
