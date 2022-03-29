import { AlunaError } from '../../../lib/core/AlunaError'
import { AlunaFeaturesModeEnum } from '../../../lib/enums/AlunaFeaturesModeEnum'
import { AlunaHttpVerbEnum } from '../../../lib/enums/AlunaHtttpVerbEnum'
import { AlunaAccountsErrorCodes } from '../../../lib/errors/AlunaAccountsErrorCodes'
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
import { BinanceHttp } from '../BinanceHttp'
import { BinanceLog } from '../BinanceLog'
import {
  BinanceSpecs,
  PROD_BINANCE_URL,
} from '../BinanceSpecs'
import { BinanceOrderSideAdapter } from '../enums/adapters/BinanceOrderSideAdapter'
import { BinanceOrderTypeAdapter } from '../enums/adapters/BinanceOrderTypeAdapter'
import { BinanceOrderTimeInForceEnum } from '../enums/BinanceOrderTimeInForceEnum'
import { BinanceOrderTypeEnum } from '../enums/BinanceOrderTypeEnum'
import {
  IBinanceOrderRequest,
  IBinanceOrderSchema,
} from '../schemas/IBinanceOrderSchema'
import { BinanceMarketModule } from './BinanceMarketModule'
import { BinanceOrderReadModule } from './BinanceOrderReadModule'



export class BinanceOrderWriteModule extends BinanceOrderReadModule implements IAlunaOrderWriteModule {

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

      const accountSpecs = BinanceSpecs.accounts.find((a) => a.type === account)

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
            `Account type '${account}' not supported/implemented for Binance`,
          code: AlunaAccountsErrorCodes.TYPE_NOT_SUPPORTED,
        })

      }

      const orderType = orderTypes.find((o) => o.type === type)

      if (!orderType || !orderType.implemented || !orderType.supported) {

        throw new AlunaError({
          message: `Order type '${type}' not supported/implemented for Binance`,
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

      BinanceLog.error(error)

      throw error

    }

    const translatedOrderType = BinanceOrderTypeAdapter.translateToBinance({
      from: type,
    })

    apiRequestCount += 1

    const body: IBinanceOrderRequest = {
      side: BinanceOrderSideAdapter.translateToBinance({ from: side }),
      symbol: symbolPair,
      type: translatedOrderType,
      quantity: amount,
    }

    apiRequestCount += 1

    if (translatedOrderType === BinanceOrderTypeEnum.LIMIT) {

      Object.assign(body, {
        price: rate,
        timeInForce: BinanceOrderTimeInForceEnum.GOOD_TIL_CANCELED,
      })

    }

    BinanceLog.info('placing new order for Binance')

    let placedOrder: IBinanceOrderSchema

    try {

      const {
        data: createdOrder,
        apiRequestCount: requestCount,
      } = await BinanceHttp
        .privateRequest<IBinanceOrderSchema>({
          url: `${PROD_BINANCE_URL}/api/v3/order`,
          body,
          keySecret: this.exchange.keySecret,
        })

      placedOrder = createdOrder
      apiRequestCount += requestCount

    } catch (err) {

      // Insufficient Balance code
      if (err.metadata.code === -2010) {

        throw new AlunaError({
          httpStatusCode: err.httpStatusCode,
          message: err.message,
          code: AlunaBalanceErrorCodes.INSUFFICIENT_BALANCE,
          metadata: err.metadata,
        })

      }

      throw new AlunaError({
        ...err,
        code: AlunaOrderErrorCodes.PLACE_FAILED,
      })

    }

    const {
      rawMarkets,
      apiRequestCount: listRawCount,
    } = await BinanceMarketModule.listRaw()

    apiRequestCount += 1

    const symbolInfo = rawMarkets.find((rM) => rM.symbol === placedOrder.symbol)

    const { order, apiRequestCount: parseCount } = await this.parse({
      rawOrder: placedOrder,
      symbolInfo,
    })

    apiRequestCount += 1

    const totalApiRequestCount = apiRequestCount + parseCount

    return {
      order,
      apiRequestCount: totalApiRequestCount,
    }

  }



  public async cancel (
    params: IAlunaOrderGetParams,
  ): Promise<IAlunaOrderGetReturns> {

    BinanceLog.info('canceling order for Binance')

    const {
      id,
      symbolPair,
    } = params

    let apiRequestCount = 0

    const body = {
      orderId: id,
      symbol: symbolPair,
    }

    let canceledOrder: IBinanceOrderSchema

    try {

      const {
        data: canceledOrderResponse,
        apiRequestCount: requestCount,
      } = await BinanceHttp.privateRequest<IBinanceOrderSchema>(
        {
          verb: AlunaHttpVerbEnum.DELETE,
          url: `${PROD_BINANCE_URL}/api/v3/order`,
          keySecret: this.exchange.keySecret,
          body,
        },
      )

      canceledOrder = canceledOrderResponse
      apiRequestCount += requestCount

    } catch (err) {

      const error = new AlunaError({
        message: 'Something went wrong, order not canceled',
        httpStatusCode: err.httpStatusCode,
        code: AlunaOrderErrorCodes.CANCEL_FAILED,
        metadata: err.metadata,
      })

      BinanceLog.error(error)

      throw error

    }

    const { apiRequestCount: getRequestCount, order } = await this.get({
      id: canceledOrder.orderId.toString(),
      symbolPair: canceledOrder.symbol,
    })

    apiRequestCount += 1

    const totalApiRequestCount = apiRequestCount + getRequestCount

    return {
      order,
      apiRequestCount: totalApiRequestCount,
    }

  }


  public async edit (
    params: IAlunaOrderEditParams,
  ): Promise<IAlunaOrderEditReturns> {

    validateParams({
      params,
      schema: editOrderParamsSchema,
    })

    BinanceLog.info('editing order for Binance')

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
      + placeRequestCount
      + cancelRequestCount

    return {
      order: newOrder,
      apiRequestCount: totalApiRequestCount,
    }

  }

}
