import { AlunaError } from '../../../lib/core/AlunaError'
import { AlunaAccountEnum } from '../../../lib/enums/AlunaAccountEnum'
import { AlunaFeaturesModeEnum } from '../../../lib/enums/AlunaFeaturesModeEnum'
import { AlunaOrderTypesEnum } from '../../../lib/enums/AlunaOrderTypesEnum'
import { AlunaAccountsErrorCodes } from '../../../lib/errors/AlunaAccountsErrorCodes'
import { AlunaAdaptersErrorCodes } from '../../../lib/errors/AlunaAdaptersErrorCodes'
import { AlunaBalanceErrorCodes } from '../../../lib/errors/AlunaBalanceErrorCodes'
import { AlunaHttpErrorCodes } from '../../../lib/errors/AlunaHttpErrorCodes'
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
import { BitfinexHttp } from '../BitfinexHttp'
import { BitfinexLog } from '../BitfinexLog'
import { BitfinexSpecs } from '../BitfinexSpecs'
import { BitfinexOrderSideAdapter } from '../enums/adapters/BitfinexOrderSideAdapter'
import { BitfinexOrderTypeAdapter } from '../enums/adapters/BitfinexOrderTypeAdapter'
import { IBitfinexOrderSchema } from '../schemas/IBitfinexOrderSchema'
import { BitfinexOrderReadModule } from './BitfinexOrderReadModule'



type TBitfinexPlaceOrderResponse = [
  MTS: number,
  TYPE: string,
  MESSAGE_ID: string | null,
  PLACE_HOLDER: null,
  ORDER: [IBitfinexOrderSchema],
  CODE: number,
  STATUS: 'SUCCESS' | 'ERROR' | 'FAILURE',
  TEXT: string,
]



type TBitfinexEditCancelOrderResponse = [
  MTS: number,
  TYPE: string,
  MESSAGE_ID: string | null,
  PLACE_HOLDER: null,
  ORDER: IBitfinexOrderSchema,
  CODE: number,
  STATUS: 'SUCCESS' | 'ERROR' | 'FAILURE',
  TEXT: string,
]



interface IPlaceOrEditOrderParams extends IAlunaOrderPlaceParams {
  id?: string
}



export class BitfinexOrderWriteModule extends BitfinexOrderReadModule implements IAlunaOrderWriteModule {

  public async place (
    params: IAlunaOrderPlaceParams,
  ): Promise<IAlunaOrderPlaceReturns> {

    validateParams({
      params,
      schema: placeOrderParamsSchema,
    })

    const {
      type,
      account,
    } = params

    let requestCount = 0

    this.validateOrderTypeAgainstExchangeSpecs({
      account,
      type,
    })

    const body = this.assembleBodyRequest({
      action: 'place',
      orderParams: params,
    })

    BitfinexLog.info('placing new order for Bitfinex')

    const { privateRequest } = BitfinexHttp

    let rawOrder: IBitfinexOrderSchema

    try {

      const {
        data: response,
        requestCount: privateRequestCount,
      } = await privateRequest<TBitfinexPlaceOrderResponse>({
        url: 'https://api.bitfinex.com/v2/auth/w/order/submit',
        body,
        keySecret: this.exchange.keySecret,
      })

      requestCount += privateRequestCount

      const [
        _mts,
        _type,
        _messageId,
        _placeHolder,
        [placedOrder],
        _code,
        status,
        text,
      ] = response

      if (status !== 'SUCCESS') {

        throw new AlunaError({
          code: AlunaOrderErrorCodes.PLACE_FAILED,
          message: text,
        })

      }

      rawOrder = placedOrder

    } catch (err) {

      const { message, metadata } = err

      let {
        code,
        httpStatusCode,
      } = err

      if (/not enough.+balance/i.test(err.message)) {

        code = AlunaBalanceErrorCodes.INSUFFICIENT_BALANCE
        httpStatusCode = 400

      }

      const error = new AlunaError({
        message,
        code,
        httpStatusCode,
        metadata,
      })

      BitfinexLog.error(error)

      throw error

    }

    const {
      order: parsedOrder,
      requestCount: parseCount,
    } = await this.parse({ rawOrder })

    const totalRequestCount = requestCount + parseCount

    return {
      order: parsedOrder,
      requestCount: totalRequestCount,
    }

  }

  async edit (params: IAlunaOrderEditParams): Promise<IAlunaOrderEditReturns> {

    validateParams({
      params,
      schema: editOrderParamsSchema,
    })

    const {
      type,
      account,
    } = params

    let requestCount = 0

    this.validateOrderTypeAgainstExchangeSpecs({
      account,
      type,
    })

    const body = this.assembleBodyRequest({
      action: 'edit',
      orderParams: params,
    })

    BitfinexLog.info('editing order for Bitfinex')

    const { privateRequest } = BitfinexHttp

    let rawOrder: IBitfinexOrderSchema

    try {

      const {
        data: response,
        requestCount: privateRequestCount,
      } = await privateRequest<TBitfinexEditCancelOrderResponse>({
        url: 'https://api.bitfinex.com/v2/auth/w/order/update',
        body,
        keySecret: this.exchange.keySecret,
      })

      requestCount += privateRequestCount

      const [
        _mts,
        _type,
        _messageId,
        _placeHolder,
        editedOrder,
        _code,
        status,
        text,
      ] = response

      if (status !== 'SUCCESS') {

        throw new AlunaError({
          code: AlunaHttpErrorCodes.REQUEST_ERROR,
          message: text,
        })

      }

      // Bitfinex already returns the order edited/updated
      rawOrder = editedOrder

    } catch (err) {

      const { httpStatusCode, metadata } = err

      let {
        code,
        message,
      } = err

      if (/order: invalid/.test(err.message)) {

        code = AlunaOrderErrorCodes.NOT_FOUND
        message = 'order was not found or may not be open'

      } else if (/not enough.+balance/i.test(err.message)) {

        code = AlunaBalanceErrorCodes.INSUFFICIENT_BALANCE

      }

      const error = new AlunaError({
        message,
        code,
        metadata,
        httpStatusCode,
      })

      BitfinexLog.error(error)

      throw error

    }

    const {
      order: parsedOrder,
      requestCount: parseCount,
    } = await this.parse({ rawOrder })

    const totalRequestCount = requestCount + parseCount

    return {
      order: parsedOrder,
      requestCount: totalRequestCount,
    }

  }

  public async cancel (
    params: IAlunaOrderGetParams,
  ): Promise<IAlunaOrderGetReturns> {

    const { id } = params

    BitfinexLog.info('canceling order for Bitfinex')

    const { privateRequest } = BitfinexHttp

    let requestCount = 0

    try {

      const {
        data: response,
        requestCount: privateRequestCount,
      } = await privateRequest<TBitfinexPlaceOrderResponse>({
        url: 'https://api.bitfinex.com/v2/auth/w/order/cancel',
        body: { id: Number(id) },
        keySecret: this.exchange.keySecret,
      })

      requestCount += privateRequestCount

      const [
        _mts,
        _type,
        _messageId,
        _placeHolder,
        _canceledOrder, // Bitfinex do not return the order with canceled status
        _code,
        status,
        text,
      ] = response

      if (status !== 'SUCCESS') {

        throw new AlunaError({
          code: AlunaOrderErrorCodes.CANCEL_FAILED,
          message: text,
        })

      }

    } catch (err) {

      const error = new AlunaError({
        message: err.message,
        code: AlunaOrderErrorCodes.CANCEL_FAILED,
        metadata: err.metadata,
        httpStatusCode: err.httpStatusCode,
      })

      BitfinexLog.error(error)

      throw error

    }

    const {
      order: parsedOrder,
      requestCount: getCount,
    } = await this.get(params)

    const totalRequestCount = requestCount + getCount

    return {
      order: parsedOrder,
      requestCount: totalRequestCount,
    }

  }

  private assembleBodyRequest (params: {
    action: 'place' | 'edit',
    orderParams: IPlaceOrEditOrderParams,
  }): Record<string, any> {

    const {
      action,
      orderParams,
    } = params

    const {
      id,
      amount,
      symbolPair,
      side,
      type,
      account,
      rate,
      limitRate,
      stopRate,
    } = orderParams


    const translatedOrderType = BitfinexOrderTypeAdapter.translateToBitfinex({
      account,
      from: type,
    })

    const translatedAmount = BitfinexOrderSideAdapter.translateToBitfinex({
      amount: Number(amount),
      side,
    })

    let price: undefined | string
    let priceAuxLimit: undefined | string

    switch (type) {

      case AlunaOrderTypesEnum.LIMIT:
        price = rate!.toString()
        break

      case AlunaOrderTypesEnum.STOP_MARKET:
        price = stopRate!.toString()
        break

      case AlunaOrderTypesEnum.STOP_LIMIT:
        price = stopRate!.toString()
        priceAuxLimit = limitRate!.toString()
        break

      default:

    }

    const body = {
      amount: translatedAmount,
      ...(price ? { price } : {}),
      ...(priceAuxLimit ? { price_aux_limit: priceAuxLimit } : {}),
    }

    if (action === 'place') {

      Object.assign(body, {
        symbol: symbolPair,
        type: translatedOrderType,
      })

    } else {

      Object.assign(body, { id: Number(id) })

    }

    return body

  }


  private validateOrderTypeAgainstExchangeSpecs (params: {
    type: AlunaOrderTypesEnum,
    account: AlunaAccountEnum,
  }): void {

    const {
      type,
      account,
    } = params

    try {

      const accountSpecs = BitfinexSpecs.accounts.find((a) => {

        return a.type === account

      })

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

      if (!supported || !implemented || !supportedOrderTypes) {

        throw new AlunaError({
          message: `Account type '${account}' not supported/implemented for Bitfinex`,
          code: AlunaAccountsErrorCodes.TYPE_NOT_SUPPORTED,
        })

      }

      const orderType = supportedOrderTypes.find((o) => o.type === type)

      if (!orderType || !orderType.implemented || !orderType.supported) {

        throw new AlunaError({
          message: `Order type '${type}' not supported/implemented for Bitfinex`,
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

      BitfinexLog.error(error)

      throw error

    }

  }

}
