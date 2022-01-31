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
          code: AlunaAccountsErrorCodes.TYPE_NOT_FOUND
        })

      }

      const {
        supported,
        implemented,
        orderTypes,
      } = accountSpecs

      // TODO: Order types should be required (review all occurrencies)
      if (!supported || !implemented) {

        throw new AlunaError({
          message:
            `Account type '${account}' not supported/implemented for Binance`,
            code: AlunaAccountsErrorCodes.TYPE_NOT_SUPPORTED
        })

      }

      const orderType = orderTypes.find((o) => o.type === type)

      if (!orderType || !orderType.implemented || !orderType.supported) {

        throw new AlunaError({
          message: `Order type '${type}' not supported/implemented for Binance`,
          code: AlunaOrderErrorCodes.TYPE_NOT_SUPPORTED
        })

      }

      if (orderType.mode === AlunaFeaturesModeEnum.READ) {

        throw new AlunaError({
          message: `Order type '${type}' is in read mode`,
          code: AlunaOrderErrorCodes.TYPE_IS_READ_ONLY
        })

      }

    } catch (error) {

      BinanceLog.error(error)

      throw error

    }

    const translatedOrderType = BinanceOrderTypeAdapter.translateToBinance({
      from: type,
    })

    const body = {
      side: BinanceSideAdapter.translateToBinance({ from: side }),
      symbol: symbolPair,
      type: translatedOrderType,
      quantity: amount,
    }

    if (translatedOrderType === BinanceOrderTypeEnum.LIMIT) {

      // QUESTION: Is Time-in-force really required?
      Object.assign(body, {
        price: rate,
        timeInForce: BinanceOrderTimeInForceEnum.GTC,
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

    await BinanceHttp.privateRequest<void>({
      verb: AlunaHttpVerbEnum.DELETE,
      url: `${PROD_BINANCE_URL}/api/v3/order`,
      keySecret: this.exchange.keySecret,
      body,
    })

    // TODO: Prefer validating if the order was canceled based on the request
    // response
    const rawOrder = await this.getRaw(params)

    if (rawOrder.status !== BinanceOrderStatusEnum.CANCELED) {

      const error = new AlunaError({
        message: 'Something went wrong, order not canceled',
        httpStatusCode: 500,
        code: AlunaHttpErrorCodes.REQUEST_ERROR
      })

      BinanceLog.error(error)

      throw error

    }

    const parsedOrder = this.parse({ rawOrder })

    return parsedOrder

  }


  public async edit(params: IAlunaOrderEditParams): Promise<IAlunaOrderSchema> {

    // TODO -> Add Logic to function
    return null as any
  }

}
