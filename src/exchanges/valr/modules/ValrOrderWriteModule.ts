import { AlunaError } from '../../../lib/core/AlunaError'
import { AlunaFeaturesModeEnum } from '../../../lib/enums/AlunaFeaturesModeEnum'
import { AlunaHttpVerbEnum } from '../../../lib/enums/AlunaHtttpVerbEnum'
import { AlunaAccountsErrorCodes } from '../../../lib/errors/AlunaAccountsErrorCodes'
import { AlunaAdaptersErrorCodes } from '../../../lib/errors/AlunaAdaptersErrorCodes'
import { AlunaBalanceErrorCodes } from '../../../lib/errors/AlunaBalanceErrorCodes'
import { AlunaOrderErrorCodes } from '../../../lib/errors/AlunaOrderErrorCodes'
import {
  IAlunaOrderEditParams,
  IAlunaOrderEditReturns,
  IAlunaOrderGetParams,
  IAlunaOrderGetReturns,
  IAlunaOrderPlaceParams,
  IAlunaOrderPlaceReturns,
  IAlunaOrderWriteModule,
} from '../../../lib/modules/IAlunaOrderModule'
import { editOrderParamsSchema } from '../../../utils/validation/schemas/editOrderParamsSchema'
import { placeOrderParamsSchema } from '../../../utils/validation/schemas/placeOrderParamsSchema'
import { validateParams } from '../../../utils/validation/validateParams'
import { ValrOrderSideAdapter } from '../enums/adapters/ValrOrderSideAdapter'
import { ValrOrderTypeAdapter } from '../enums/adapters/ValrOrderTypeAdapter'
import { ValrOrderStatusEnum } from '../enums/ValrOrderStatusEnum'
import { ValrOrderTimeInForceEnum } from '../enums/ValrOrderTimeInForceEnum'
import { ValrOrderTypesEnum } from '../enums/ValrOrderTypesEnum'
import { IValrOrderGetSchema } from '../schemas/IValrOrderSchema'
import { ValrHttp } from '../ValrHttp'
import { ValrLog } from '../ValrLog'
import { ValrSpecs } from '../ValrSpecs'
import { ValrOrderReadModule } from './ValrOrderReadModule'



interface IValrPlaceOrderResponse {
  id: string
}

export class ValrOrderWriteModule extends ValrOrderReadModule implements IAlunaOrderWriteModule {

  public async place (
    params: IAlunaOrderPlaceParams,
  ): Promise<IAlunaOrderPlaceReturns> {

    validateParams({
      params,
      schema: placeOrderParamsSchema,
    })

    const {
      amount,
      rate,
      symbolPair,
      side,
      type,
      account,
    } = params

    let apiRequestCount = 0

    try {

      const accountSpecs = ValrSpecs.accounts.find((a) => a.type === account)

      if (!accountSpecs) {

        throw new AlunaError({
          message: `Account type '${account}' not found`,
          code: AlunaAdaptersErrorCodes.NOT_FOUND,
        })

      }

      const {
        supported,
        implemented,
        orderTypes: supportedOrderTypes,
      } = accountSpecs

      if (!supported || !implemented) {

        throw new AlunaError({
          message: `Account type '${account}' not supported/implemented for Valr`,
          code: AlunaAccountsErrorCodes.TYPE_NOT_SUPPORTED,
        })

      }

      const orderType = supportedOrderTypes.find((o) => o.type === type)

      if (!orderType || !orderType.implemented || !orderType.supported) {

        throw new AlunaError({
          message: `Order type '${type}' not supported/implemented for Valr`,
          code: AlunaOrderErrorCodes.TYPE_NOT_SUPPORTED,
        })

      }

      if (orderType.mode === AlunaFeaturesModeEnum.READ) {

        throw new AlunaError({
          message: `Order type '${type}' is in read mode`,
          code: AlunaOrderErrorCodes.TYPE_IS_READ_ONLY,
        })

      }

    } catch (error) {

      ValrLog.error(error)

      throw error

    }

    const body = {
      side: ValrOrderSideAdapter.translateToValr({ from: side }),
      pair: symbolPair,
    }

    apiRequestCount += 1

    const translatedOrderType = ValrOrderTypeAdapter.translateToValr({
      from: type,
    })

    apiRequestCount += 1

    if (translatedOrderType === ValrOrderTypesEnum.LIMIT) {

      Object.assign(body, {
        quantity: amount,
        price: rate,
        postOnly: false,
        timeInForce: ValrOrderTimeInForceEnum.GOOD_TILL_CANCELLED,
      })

    } else {

      Object.assign(body, {
        baseAmount: amount,
      })

    }

    ValrLog.info('placing new order for valr')

    const {
      data: { id },
      apiRequestCount: requestCount,
    } = await ValrHttp.privateRequest<IValrPlaceOrderResponse>({
      url: `https://api.valr.com/v1/orders/${translatedOrderType}`,
      body,
      keySecret: this.exchange.keySecret,
    })


    const { order, apiRequestCount: getRequestCount } = await this.get({
      id,
      symbolPair,
    })

    apiRequestCount += 1

    const meta: IValrOrderGetSchema = (order.meta as IValrOrderGetSchema)

    if (meta.orderStatusType === ValrOrderStatusEnum.FAILED) {

      let code = AlunaOrderErrorCodes.PLACE_FAILED

      if (meta.failedReason === 'Insufficient Balance') {

        code = AlunaBalanceErrorCodes.INSUFFICIENT_BALANCE

      }

      throw new AlunaError({
        message: meta.failedReason,
        code,
      })

    }

    const totalApiRequestCount = apiRequestCount
      + getRequestCount
      + requestCount

    const response: IAlunaOrderPlaceReturns = {
      order,
      apiRequestCount: totalApiRequestCount,
    }

    return response

  }

  async edit (params: IAlunaOrderEditParams): Promise<IAlunaOrderEditReturns> {

    ValrLog.info('editing order for Valr')

    validateParams({
      params,
      schema: editOrderParamsSchema,
    })

    const {
      id,
      rate,
      side,
      type,
      amount,
      account,
      symbolPair,
    } = params

    let apiRequestCount = 0

    const {
      rawOrder,
      apiRequestCount: getRawCount,
    } = await this.getRaw({
      id,
      symbolPair,
    })

    apiRequestCount += 1

    const { orderStatusType } = rawOrder

    let isOrderOpen: boolean

    switch (orderStatusType) {

      case ValrOrderStatusEnum.ACTIVE:
      case ValrOrderStatusEnum.PLACED:
      case ValrOrderStatusEnum.PARTIALLY_FILLED:

        isOrderOpen = true

        break

      default:

        isOrderOpen = false

    }

    if (!isOrderOpen) {

      throw new AlunaError({
        message: 'Order is not open/active anymore',
        code: AlunaOrderErrorCodes.IS_NOT_OPEN,
      })

    }

    const { apiRequestCount: cancelRequestCount } = await this.cancel({
      id,
      symbolPair,
    })

    apiRequestCount += 1

    const {
      order: newOrder,
      apiRequestCount: placeRequestCount,
    } = await this.place({
      rate,
      side,
      type,
      amount,
      account,
      symbolPair,
    })

    apiRequestCount += 1

    const totalApiRequestCount = apiRequestCount
      + cancelRequestCount
      + placeRequestCount
      + getRawCount

    const response: IAlunaOrderEditReturns = {
      apiRequestCount: totalApiRequestCount,
      order: newOrder,
    }

    return response

  }

  public async cancel (
    params: IAlunaOrderGetParams,
  ): Promise<IAlunaOrderGetReturns> {

    ValrLog.info('canceling order for Valr')

    const {
      id,
      symbolPair,
    } = params

    let apiRequestCount = 0

    const body = {
      orderId: id,
      pair: symbolPair,
    }

    const {
      apiRequestCount: requestCount,
    } = await ValrHttp.privateRequest<void>({
      verb: AlunaHttpVerbEnum.DELETE,
      url: 'https://api.valr.com/v1/orders/order',
      keySecret: this.exchange.keySecret,
      body,
    })



    const {
      rawOrder,
      apiRequestCount: getRawCount,
    } = await this.getRaw(params)

    apiRequestCount += 1

    if (rawOrder.orderStatusType !== ValrOrderStatusEnum.CANCELLED) {

      const error = new AlunaError({
        httpStatusCode: 500,
        message: 'Something went wrong, order not canceled',
        code: AlunaOrderErrorCodes.CANCEL_FAILED,
      })

      ValrLog.error(error)

      throw error

    }

    const {
      order: parsedOrder,
      apiRequestCount: parseCount,
    } = await this.parse({ rawOrder })

    apiRequestCount += 1

    const totalApiRequestCount = apiRequestCount
      + parseCount
      + getRawCount
      + requestCount

    const response: IAlunaOrderGetReturns = {
      order: parsedOrder,
      apiRequestCount: totalApiRequestCount,
    }

    return response

  }

}
