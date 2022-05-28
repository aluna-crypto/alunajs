import { debug } from 'debug'
import { AlunaError } from '../../../../../lib/core/AlunaError'

import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import { AlunaHttpVerbEnum } from '../../../../../lib/enums/AlunaHtttpVerbEnum'
import {
  IAlunaKeyFetchDetailsParams,
  IAlunaKeyFetchDetailsReturns,
} from '../../../../../lib/modules/authed/IAlunaKeyModule'
import { FtxHttp } from '../../../FtxHttp'
import { getFtxEndpoints } from '../../../ftxSpecs'
import { IFtxKeySchema } from '../../../schemas/IFtxKeySchema'
import { AlunaKeyErrorCodes } from '../../../../../lib/errors/AlunaKeyErrorCodes'



const log = debug('alunajs:ftx/key/fetchDetails')



export const fetchDetails = (exchange: IAlunaExchangeAuthed) => async (
  params: IAlunaKeyFetchDetailsParams = {},
): Promise<IAlunaKeyFetchDetailsReturns> => {

  log('fetching Ftx key permissions')

  const {
    settings,
    credentials,
  } = exchange

  const { http = new FtxHttp(settings) } = params

  const rawKey = await http.authedRequest<IFtxKeySchema>({
    verb: AlunaHttpVerbEnum.GET,
    url: getFtxEndpoints(settings).key.fetchDetails,
    credentials,
  })

  if (!rawKey.account) {

    throw new AlunaError({
      code: AlunaKeyErrorCodes.INVALID,
      message: 'Invalid key provided',
      httpStatusCode: 403,
      metadata: rawKey,
    })

  }

  const { key } = exchange.key.parseDetails({ rawKey })

  const { requestWeight } = http

  return {
    key,
    requestWeight,
  }

}
