import { debug } from 'debug'

import { AlunaError } from '../../../../../lib/core/AlunaError'
import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import { AlunaOrderErrorCodes } from '../../../../../lib/errors/AlunaOrderErrorCodes'
import {
  IAlunaOrderGetParams,
  IAlunaOrderGetRawReturns,
} from '../../../../../lib/modules/authed/IAlunaOrderModule'
import { PoloniexOrderStatusEnum } from '../../../enums/PoloniexOrderStatusEnum'
import { PoloniexHttp } from '../../../PoloniexHttp'
import {
  IPoloniexOrderInfo,
  IPoloniexOrderStatusInfoSchema,
} from '../../../schemas/IPoloniexOrderSchema'
import { fetchOrderStatus } from './helpers/fetchOrderStatus'
import { fetchOrderTrades } from './helpers/fetchOrderTrades'



const log = debug('@alunajs:poloniex/order/getRaw')



export const getRaw = (exchange: IAlunaExchangeAuthed) => async (
  params: IAlunaOrderGetParams,
): Promise<IAlunaOrderGetRawReturns<IPoloniexOrderInfo | IPoloniexOrderStatusInfoSchema>> => {

  log('getting raw order', params)

  const {
    settings,
    credentials,
  } = exchange

  const {
    id,
    symbolPair,
    http = new PoloniexHttp(settings),
  } = params

  let result
  let orderTrades: IPoloniexOrderInfo[] = []

  try {

    const rawOrderStatus = await fetchOrderStatus({
      id,
      credentials,
      http,
      settings,
    })

    result = rawOrderStatus

  } catch (err) {

    try {

      const rawOrderTrades = await fetchOrderTrades({
        id,
        credentials,
        http,
        settings,
      })

      orderTrades = rawOrderTrades

    } catch (err) {

      throw new AlunaError({
        code: AlunaOrderErrorCodes.ORDER_CANCELLED,
        message: 'This order is already cancelled',
        httpStatusCode: 422,
        metadata: err.metadata,
      })

    }

  }

  const { requestWeight } = http

  if (!result && !orderTrades.length) {

    throw new AlunaError({
      code: AlunaOrderErrorCodes.NOT_FOUND,
      message: 'Order not found',
      httpStatusCode: 404,
    })

  }

  if (result) {

    // result doesn't return orderNumber
    const resultWithOrderNumber: IPoloniexOrderStatusInfoSchema = {
      ...result,
      orderNumber: id,
    }

    return {
      rawOrder: resultWithOrderNumber,
      requestWeight,
    }

  }

  const rawOrderTradeWithStatus: IPoloniexOrderStatusInfoSchema = {
    ...orderTrades[0],
    currencyPair: symbolPair,
    status: PoloniexOrderStatusEnum.FILLED,
    orderNumber: id,
  }

  return {
    rawOrder: rawOrderTradeWithStatus,
    requestWeight,
  }

}
