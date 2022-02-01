import {
  AlunaAccountsErrorCodes,
  AlunaHttpErrorCodes,
  AlunaOrderErrorCodes,
  IAlunaOrderEditParams,
} from '../../..'
import { AlunaError } from '../../../lib/core/AlunaError'
import { AlunaFeaturesModeEnum } from '../../../lib/enums/AlunaFeaturesModeEnum'
import { AlunaHttpVerbEnum } from '../../../lib/enums/AlunaHtttpVerbEnum'
import {
  IAlunaOrderCancelParams,
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
import { BinanceOrderStatusEnum } from '../enums/BinanceOrderStatusEnum'
import { BinanceOrderTimeInForceEnum } from '../enums/BinanceOrderTimeInForceEnum'
import { BinanceOrderTypeEnum } from '../enums/BinanceOrderTypeEnum'
import {
  IBinanceOrderRequest,
  IBinanceOrderSchema,
} from '../schemas/IBinanceOrderSchema'
import { BinanceOrderReadModule } from './BinanceOrderReadModule'



interface IBinancePlaceOrderResponse {
  orderId: string
}



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

      if (!supported || !implemented) {

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

      Object.assign(body, {
        price: rate,
        timeInForce: BinanceOrderTimeInForceEnum.GOOD_TIL_CANCELED,
      })

    }

    BinanceLog.info('placing new order for Binance')

    const { orderId } = await BinanceHttp
      .privateRequest<IBinancePlaceOrderResponse>({
        url: `${PROD_BINANCE_URL}/api/v3/order`,
        body,
        keySecret: this.exchange.keySecret,
      })

    const order = await this.get({
      id: orderId,
      symbolPair,
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

    const canceledOrder = await BinanceHttp.privateRequest<IBinanceOrderSchema>(
      {
        verb: AlunaHttpVerbEnum.DELETE,
        url: `${PROD_BINANCE_URL}/api/v3/order`,
        keySecret: this.exchange.keySecret,
        body,
      },
    )

    if (canceledOrder.status !== BinanceOrderStatusEnum.CANCELED) {

      const error = new AlunaError({
        message: 'Something went wrong, order not canceled',
        httpStatusCode: 500,
        code: AlunaHttpErrorCodes.REQUEST_ERROR,
      })

      BinanceLog.error(error)

      throw error

    }

    const parsedOrder = this.parse({ rawOrder: canceledOrder })

    return parsedOrder

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

    const rawOrder = await this.getRaw({
      id,
      symbolPair,
    })

    const { status } = rawOrder

    let isOrderOpen: boolean

    switch (status) {

      case BinanceOrderStatusEnum.NEW:
      case BinanceOrderStatusEnum.PARTIALLY_FILLED:

        isOrderOpen = true

        break

      default:

        isOrderOpen = false

    }

    if (!isOrderOpen) {

      throw new AlunaError({
        httpStatusCode: 200,
        message: 'Order is not open/active anymore',
        code: AlunaOrderErrorCodes.IS_NOT_OPEN,
      })

    }

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
