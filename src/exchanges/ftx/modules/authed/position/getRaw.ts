import debug from 'debug'
import { find } from 'lodash'

import { AlunaError } from '../../../../../lib/core/AlunaError'
import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import { AlunaHttpVerbEnum } from '../../../../../lib/enums/AlunaHtttpVerbEnum'
import { AlunaGenericErrorCodes } from '../../../../../lib/errors/AlunaGenericErrorCodes'
import { AlunaPositionErrorCodes } from '../../../../../lib/errors/AlunaPositionErrorCodes'
import {
  IAlunaPositionGetParams,
  IAlunaPositionGetRawReturns,
} from '../../../../../lib/modules/authed/IAlunaPositionModule'
import { FtxHttp } from '../../../FtxHttp'
import { getFtxEndpoints } from '../../../ftxSpecs'
import { IFtxPositionSchema } from '../../../schemas/IFtxPositionSchema'



const log = debug('alunajs:bitfinex/position/getRaw')



export const getRaw = (exchange: IAlunaExchangeAuthed) => async (
  params: IAlunaPositionGetParams,
): Promise<IAlunaPositionGetRawReturns<IFtxPositionSchema>> => {

  const {
    settings,
    credentials,
  } = exchange

  const {
    symbolPair,
    http = new FtxHttp(exchange.settings),
  } = params

  log('getting raw position', { symbolPair })

  if (!symbolPair) {

    const error = new AlunaError({
      code: AlunaGenericErrorCodes.PARAM_ERROR,
      message: 'Position symbol is required to get Ftx positions',
      httpStatusCode: 400,
    })

    log(error)

    throw error

  }

  const response = await http.authedRequest<IFtxPositionSchema[]>({
    credentials,
    url: getFtxEndpoints(settings).position.list,
    verb: AlunaHttpVerbEnum.GET,
  })

  const rawPosition = find(response, { future: symbolPair })

  if (!rawPosition) {
    throw new AlunaError({
      code: AlunaPositionErrorCodes.NOT_FOUND,
      message: 'Position not found',
      httpStatusCode: 400,
    })
  }

  const { requestWeight } = http

  return {
    rawPosition,
    requestWeight,
  }

}
