import { AlunaError } from '../../../lib/core/AlunaError'
import { AlunaFeaturesModeEnum } from '../../../lib/enums/AlunaFeaturesModeEnum'
import { AlunaHttpVerbEnum } from '../../../lib/enums/AlunaHtttpVerbEnum'
import { AlunaAccountsErrorCodes } from '../../../lib/errors/AlunaAccountsErrorCodes'
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
import { HuobiOrderSideAdapter } from '../enums/adapters/HuobiOrderSideAdapter'
import { HuobiOrderTypeAdapter } from '../enums/adapters/HuobiOrderTypeAdapter'
import { HuobiOrderTypeEnum } from '../enums/HuobiOrderTypeEnum'
import { getHuobiAccountId } from '../helpers/GetHuobiAccountId'
import { HuobiHttp } from '../HuobiHttp'
import { HuobiLog } from '../HuobiLog'
import {
  HuobiSpecs,
  PROD_HUOBI_URL,
} from '../HuobiSpecs'
import { IHuobiOrderRequest } from '../schemas/IHuobiOrderSchema'
import { HuobiOrderReadModule } from './HuobiOrderReadModule'



export class HuobiOrderWriteModule extends HuobiOrderReadModule implements IAlunaOrderWriteModule {

  public async place(
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

    let requestCount = 0

    try {

      const accountSpecs = HuobiSpecs.accounts.find((a) => a.type === account)

      if (!accountSpecs) {

        throw new AlunaError({
          message: `Account type '${account}' not found`,
          code: AlunaAccountsErrorCodes.TYPE_NOT_FOUND,
        })

      }

      const {
        supported,
        implemented,
        orderTypes,
      } = accountSpecs

      if (!supported || !implemented || !orderTypes) {

        throw new AlunaError({
          message:
            `Account type '${account}' not supported/implemented for Huobi`,
          code: AlunaAccountsErrorCodes.TYPE_NOT_SUPPORTED,
        })

      }

      const orderType = orderTypes.find((o) => o.type === type)

      if (!orderType || !orderType.implemented || !orderType.supported) {

        throw new AlunaError({
          message: `Order type '${type}' not supported/implemented for Huobi`,
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

      HuobiLog.error(error)

      throw error

    }

    const translatedOrderType = HuobiOrderTypeAdapter.translateToHuobi({
      from: type,
    })

    const translatedSide = HuobiOrderSideAdapter.translateToHuobi({
      from: side,
    })

    const {
      accountId,
      requestCount: getHuobiAccountIdCount,
    } = await getHuobiAccountId(this.exchange.keySecret)

    requestCount += getHuobiAccountIdCount

    const body: IHuobiOrderRequest = {
      symbol: symbolPair,
      type: `${translatedSide}-${translatedOrderType}`,
      'account-id': accountId.toString(),
      amount: amount.toString(),
      source: 'spot-api',
    }

    if (translatedOrderType === HuobiOrderTypeEnum.LIMIT) {

      Object.assign(body, {
        price: rate!.toString(),
      })

    }

    HuobiLog.info('placing new order for Huobi')

    let placedOrderId: string

    try {

      const {
        data: createdOrder,
        requestCount: privateRequestCount,
      } = await HuobiHttp
        .privateRequest<string>({
          url: `${PROD_HUOBI_URL}/v1/order/orders/place`,
          body,
          keySecret: this.exchange.keySecret,
        })

      placedOrderId = createdOrder
      requestCount += privateRequestCount

    } catch (err) {

      throw new AlunaError({
        ...err,
        code: AlunaOrderErrorCodes.PLACE_FAILED,
      })

    }

    const { order, requestCount: parseCount } = await this.get({
      id: placedOrderId,
      symbolPair,
    })

    const totalRequestCount = requestCount
      + parseCount

    return {
      order,
      requestCount: totalRequestCount,
    }

  }



  public async cancel(
    params: IAlunaOrderGetParams,
  ): Promise<IAlunaOrderGetReturns> {

    HuobiLog.info('canceling order for Huobi')

    const {
      id,
      symbolPair,
    } = params

    let requestCount = 0

    let canceledOrder: string

    try {

      const {
        data: canceledOrderResponse,
        requestCount: privateRequestCount,
      } = await HuobiHttp.privateRequest<string>({
        verb: AlunaHttpVerbEnum.POST,
        url: `${PROD_HUOBI_URL}/v1/order/orders/${id}/submitcancel`,
        keySecret: this.exchange.keySecret,
      })

      canceledOrder = canceledOrderResponse
      requestCount += privateRequestCount

    } catch (err) {

      const error = new AlunaError({
        message: 'Something went wrong, order not canceled',
        httpStatusCode: err.httpStatusCode,
        code: AlunaOrderErrorCodes.CANCEL_FAILED,
        metadata: err.metadata,
      })

      HuobiLog.error(error)

      throw error

    }

    const { requestCount: getRequestCount, order } = await this.get({
      id,
      symbolPair,
    })

    const totalRequestCount = requestCount + getRequestCount

    return {
      order,
      requestCount: totalRequestCount,
    }

  }


  public async edit(
    params: IAlunaOrderEditParams,
  ): Promise<IAlunaOrderEditReturns> {

    validateParams({
      params,
      schema: editOrderParamsSchema,
    })

    HuobiLog.info('editing order for Huobi')

    const {
      id,
      rate,
      side,
      type,
      amount,
      account,
      symbolPair,
    } = params

    const requestCount = 0

    const { requestCount: cancelRequestCount } = await this.cancel({
      id,
      symbolPair,
    })

    const {
      order: newOrder,
      requestCount: placeRequestCount,
    } = await this.place({
      rate,
      side,
      type,
      amount,
      account,
      symbolPair,
    })

    const totalRequestCount = requestCount
      + placeRequestCount
      + cancelRequestCount

    return {
      order: newOrder,
      requestCount: totalRequestCount,
    }

  }

}
