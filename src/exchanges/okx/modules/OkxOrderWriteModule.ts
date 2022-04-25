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
import { OkxOrderSideAdapter } from '../enums/adapters/OkxOrderSideAdapter'
import { OkxOrderTypeAdapter } from '../enums/adapters/OkxOrderTypeAdapter'
import { OkxOrderTypeEnum } from '../enums/OkxOrderTypeEnum'
import { OkxHttp } from '../OkxHttp'
import { OkxLog } from '../OkxLog'
import {
  OkxSpecs,
  PROD_OKX_URL,
} from '../OkxSpecs'
import {
  IOkxOrderRequest,
  IOkxOrderSchema,
} from '../schemas/IOkxOrderSchema'
import { OkxOrderReadModule } from './OkxOrderReadModule'



export class OkxOrderWriteModule extends OkxOrderReadModule implements IAlunaOrderWriteModule {

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

    let requestCount = 0

    try {

      const accountSpecs = OkxSpecs.accounts.find((a) => a.type === account)

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
            `Account type '${account}' not supported/implemented for Okx`,
          code: AlunaAccountsErrorCodes.TYPE_NOT_SUPPORTED,
        })

      }

      const orderType = orderTypes.find((o) => o.type === type)

      if (!orderType || !orderType.implemented || !orderType.supported) {

        throw new AlunaError({
          message: `Order type '${type}' not supported/implemented for Okx`,
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

      OkxLog.error(error)

      throw error

    }

    const translatedOrderType = OkxOrderTypeAdapter.translateToOkx({
      from: type,
    })

    const body: IOkxOrderRequest = {
      side: OkxOrderSideAdapter.translateToOkx({ from: side }),
      instId: symbolPair,
      ordType: translatedOrderType,
      sz: amount.toString(),
      tdMode: 'cash',
    }

    if (translatedOrderType === OkxOrderTypeEnum.LIMIT) {

      Object.assign(body, {
        px: rate!.toString(),
      })

    }

    OkxLog.info('placing new order for Okx')

    let placedOrder: IOkxOrderSchema

    try {

      const {
        data: createdOrder,
        requestCount: privateRequestCount,
      } = await OkxHttp
        .privateRequest<IOkxOrderSchema>({
          url: `${PROD_OKX_URL}/trade/order`,
          body,
          keySecret: this.exchange.keySecret,
        })

      placedOrder = createdOrder
      requestCount += privateRequestCount

    } catch (err) {

      throw new AlunaError({
        ...err,
        code: AlunaOrderErrorCodes.PLACE_FAILED,
      })

    }

    const { order, requestCount: parseCount } = await this.parse({
      rawOrder: placedOrder,
    })

    const totalRequestCount = requestCount
      + parseCount

    return {
      order,
      requestCount: totalRequestCount,
    }

  }



  public async cancel (
    params: IAlunaOrderGetParams,
  ): Promise<IAlunaOrderGetReturns> {

    OkxLog.info('canceling order for Okx')

    const {
      id,
      symbolPair,
    } = params

    let requestCount = 0

    const body = {
      ordId: id,
      instId: symbolPair,
    }

    let canceledOrder: IOkxOrderSchema

    try {

      const {
        data: [canceledOrderResponse],
        requestCount: privateRequestCount,
      } = await OkxHttp.privateRequest<IOkxOrderSchema[]>({
        verb: AlunaHttpVerbEnum.POST,
        url: `${PROD_OKX_URL}/trade/cancel-order`,
        keySecret: this.exchange.keySecret,
        body,
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

      OkxLog.error(error)

      throw error

    }

    const { requestCount: getRequestCount, order } = await this.get({
      id: canceledOrder.ordId.toString(),
      symbolPair,
    })

    const totalRequestCount = requestCount + getRequestCount

    return {
      order,
      requestCount: totalRequestCount,
    }

  }


  public async edit (
    params: IAlunaOrderEditParams,
  ): Promise<IAlunaOrderEditReturns> {

    validateParams({
      params,
      schema: editOrderParamsSchema,
    })

    OkxLog.info('editing order for Okx')

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
