import { debug } from 'debug'
import { AlunaError } from '../../../../../lib/core/AlunaError'

import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import { AlunaHttpVerbEnum } from '../../../../../lib/enums/AlunaHtttpVerbEnum'
import { AlunaOrderTypesEnum } from '../../../../../lib/enums/AlunaOrderTypesEnum'
import { AlunaOrderErrorCodes } from '../../../../../lib/errors/AlunaOrderErrorCodes'
import {
  IAlunaOrderGetParams,
  IAlunaOrderGetRawReturns,
} from '../../../../../lib/modules/authed/IAlunaOrderModule'
import { OkxOrderTypeEnum } from '../../../enums/OkxOrderTypeEnum'
import { OkxHttp } from '../../../OkxHttp'
import { getOkxEndpoints } from '../../../okxSpecs'
import { IOkxOrderSchema } from '../../../schemas/IOkxOrderSchema'



const log = debug('alunajs:okx/order/getRaw')



export const getRaw = (exchange: IAlunaExchangeAuthed) => async (
  params: IAlunaOrderGetParams,
): Promise<IAlunaOrderGetRawReturns<IOkxOrderSchema>> => {

  log('getting raw order', params)

  const {
    settings,
    credentials,
  } = exchange

  const {
    id,
    symbolPair,
    type,
    http = new OkxHttp(settings),
  } = params

  const orderEndpoints = getOkxEndpoints(settings).order

  const isConditionalOrder = type === AlunaOrderTypesEnum.STOP_LIMIT || type === AlunaOrderTypesEnum.STOP_MARKET

  let url = orderEndpoints.get(id, symbolPair)

  if (isConditionalOrder) {

    url = orderEndpoints.getStop(OkxOrderTypeEnum.CONDITIONAL)

  }

  const resp = await http.authedRequest<IOkxOrderSchema[]>({
    credentials,
    verb: AlunaHttpVerbEnum.GET,
    url,
  })

  let [rawOrder] = resp

  if (isConditionalOrder) {

    let conditionalOrder = resp.find((order) => order.algoId === id)

    if (!conditionalOrder) {

      const ordersHistory = await await http.authedRequest<IOkxOrderSchema[]>({
        credentials,
        verb: AlunaHttpVerbEnum.GET,
        url: orderEndpoints.getStopHistory(id, OkxOrderTypeEnum.CONDITIONAL),
      })

      conditionalOrder = ordersHistory.find((order) => order.algoId === id)

    }

    if (!conditionalOrder) {

      throw new AlunaError({
        code: AlunaOrderErrorCodes.NOT_FOUND,
        message: 'Order not found',
        httpStatusCode: 200,
        metadata: resp,
      })

    }

    rawOrder = conditionalOrder

  }

  const { requestWeight } = http

  return {
    rawOrder,
    requestWeight,
  }

}
