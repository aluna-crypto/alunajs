import { AlunaError } from '../../../lib/core/AlunaError'
import { AlunaFeaturesModeEnum } from '../../../lib/enums/AlunaFeaturesModeEnum'
import { AlunaHttpVerbEnum } from '../../../lib/enums/AlunaHtttpVerbEnum'
import { AlunaAccountsErrorCodes } from '../../../lib/errors/AlunaAccountsErrorCodes'
import { AlunaBalanceErrorCodes } from '../../../lib/errors/AlunaBalanceErrorCodes'
import { AlunaGenericErrorCodes } from '../../../lib/errors/AlunaGenericErrorCodes'
import { AlunaOrderErrorCodes } from '../../../lib/errors/AlunaOrderErrorCodes'
import {
  IAlunaOrderCancelParams,
  IAlunaOrderEditParams,
  IAlunaOrderPlaceParams,
  IAlunaOrderWriteModule,
} from '../../../lib/modules/IAlunaOrderModule'
import { IAlunaOrderSchema } from '../../../lib/schemas/IAlunaOrderSchema'
import { BinanceHttp } from '../BinanceHttp'
import { BinanceLog } from '../BinanceLog'
import {
  BinanceSpecs,
  PROD_BINANCE_URL,
} from '../BinanceSpecs'
import { BinanceOrderTypeAdapter } from '../enums/adapters/BinanceOrderTypeAdapter'
import { BinanceSideAdapter } from '../enums/adapters/BinanceSideAdapter'
import { BinanceOrderTimeInForceEnum } from '../enums/BinanceOrderTimeInForceEnum'
import { BinanceOrderTypeEnum } from '../enums/BinanceOrderTypeEnum'
import {
  IBinanceOrderRequest,
  IBinanceOrderSchema,
} from '../schemas/IBinanceOrderSchema'
import { BinanceOrderReadModule } from './BinanceOrderReadModule'



export class BinanceOrderWriteModule extends BinanceOrderReadModule implements IAlunaOrderWriteModule {

  public async place (
    params: IAlunaOrderPlaceParams,
  ): Promise<IAlunaOrderSchema> {

    const {
      amount,
      rate,
      symbolPair,
      side,
      type,
      account,
    } = params

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

    const body: IBinanceOrderRequest = {
      side: BinanceSideAdapter.translateToBinance({ from: side }),
      symbol: symbolPair,
      type: translatedOrderType,
      quantity: amount,
    }

    if (translatedOrderType === BinanceOrderTypeEnum.LIMIT) {

      if (!rate) {

        throw new AlunaError({
          message: 'A rate is required for limit orders',
          code: AlunaGenericErrorCodes.PARAM_ERROR,
          httpStatusCode: 401,
        })

      }

      Object.assign(body, {
        price: rate,
        timeInForce: BinanceOrderTimeInForceEnum.GOOD_TIL_CANCELED,
      })

    }

    BinanceLog.info('placing new order for Binance')

    let placedOrder: IBinanceOrderSchema

    try {

      placedOrder = await BinanceHttp
        .privateRequest<IBinanceOrderSchema>({
          url: `${PROD_BINANCE_URL}/api/v3/order`,
          body,
          keySecret: this.exchange.keySecret,
        })

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

    const order = await this.parse({
      rawOrder: placedOrder,
    })

    return order

  }



  public async cancel (
    params: IAlunaOrderCancelParams,
  ): Promise<IAlunaOrderSchema> {

    BinanceLog.info('canceling order for Binance')

    const {
      id,
      symbolPair,
    } = params

    const body = {
      orderId: id,
      symbol: symbolPair,
    }

    let canceledOrder: IBinanceOrderSchema

    try {

      canceledOrder = await BinanceHttp.privateRequest<IBinanceOrderSchema>(
        {
          verb: AlunaHttpVerbEnum.DELETE,
          url: `${PROD_BINANCE_URL}/api/v3/order`,
          keySecret: this.exchange.keySecret,
          body,
        },
      )

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

    const order = await this.get({
      id: canceledOrder.orderId.toString(),
      symbolPair: canceledOrder.symbol,
    })

    return order

  }


  public async edit (
    params: IAlunaOrderEditParams,
  ): Promise<IAlunaOrderSchema> {


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

    await this.cancel({
      id,
      symbolPair,
    })

    const newOrder = await this.place({
      rate,
      side,
      type,
      amount,
      account,
      symbolPair,
    })

    return newOrder

  }

}
