import { AlunaError } from '../../../lib/core/AlunaError'
import { AlunaAccountEnum } from '../../../lib/enums/AlunaAccountEnum'
import { AlunaFeaturesModeEnum } from '../../../lib/enums/AlunaFeaturesModeEnum'
import { AlunaOrderTypesEnum } from '../../../lib/enums/AlunaOrderTypesEnum'
import { AlunaAccountsErrorCodes } from '../../../lib/errors/AlunaAccountsErrorCodes'
import { AlunaAdaptersErrorCodes } from '../../../lib/errors/AlunaAdaptersErrorCodes'
import { AlunaBalanceErrorCodes } from '../../../lib/errors/AlunaBalanceErrorCodes'
import { AlunaGenericErrorCodes } from '../../../lib/errors/AlunaGenericErrorCodes'
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

    const {
      type,
      account,
    } = params

    let apiRequestCount = 0

    this.validateOrderTypeAgainstExchangeSpecs({
      account,
      type,
    })

    apiRequestCount += 1

    const body = this.assembleBodyRequest({
      action: 'place',
      orderParams: params,
    })

    apiRequestCount += 1

    BitfinexLog.info('placing new order for Bitfinex')

    const { privateRequest } = BitfinexHttp

    let rawOrder: IBitfinexOrderSchema

    try {

      const {
        data: response,
        apiRequestCount: requestCount,
      } = await privateRequest<TBitfinexPlaceOrderResponse>({
        url: 'https://api.bitfinex.com/v2/auth/w/order/submit',
        body,
        keySecret: this.exchange.keySecret,
      })

      apiRequestCount += requestCount

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
      apiRequestCount: parseCount,
    } = await this.parse({ rawOrder })

    apiRequestCount += 1

    const totalApiRequestCount = apiRequestCount + parseCount

    return {
      order: parsedOrder,
      apiRequestCount: totalApiRequestCount,
    }

  }

  async edit (params: IAlunaOrderEditParams): Promise<IAlunaOrderEditReturns> {

    const {
      type,
      account,
    } = params

    let apiRequestCount = 0

    this.validateOrderTypeAgainstExchangeSpecs({
      account,
      type,
    })

    apiRequestCount += 1

    const body = this.assembleBodyRequest({
      action: 'edit',
      orderParams: params,
    })

    apiRequestCount += 1

    BitfinexLog.info('editing order for Bitfinex')

    const { privateRequest } = BitfinexHttp

    let rawOrder: IBitfinexOrderSchema

    try {

      const {
        data: response,
        apiRequestCount: requestCount,
      } = await privateRequest<TBitfinexEditCancelOrderResponse>({
        url: 'https://api.bitfinex.com/v2/auth/w/order/update',
        body,
        keySecret: this.exchange.keySecret,
      })

      apiRequestCount += requestCount

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
      apiRequestCount: parseCount,
    } = await this.parse({ rawOrder })

    const totalApiRequestCount = apiRequestCount + parseCount

    return {
      order: parsedOrder,
      apiRequestCount: totalApiRequestCount,
    }

  }

  public async cancel (
    params: IAlunaOrderGetParams,
  ): Promise<IAlunaOrderGetReturns> {

    const { id } = params

    BitfinexLog.info('canceling order for Bitfinex')

    const { privateRequest } = BitfinexHttp

    let apiRequestCount = 0

    try {

      const {
        data: response,
        apiRequestCount: requestCount,
      } = await privateRequest<TBitfinexPlaceOrderResponse>({
        url: 'https://api.bitfinex.com/v2/auth/w/order/cancel',
        body: { id: Number(id) },
        keySecret: this.exchange.keySecret,
      })

      apiRequestCount += requestCount

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
      apiRequestCount: getCount,
    } = await this.get(params)

    apiRequestCount += 1

    const totalApiRequestCount = apiRequestCount + getCount

    return {
      order: parsedOrder,
      apiRequestCount: totalApiRequestCount,
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

    const requiredParams: Record<string, any> = {}

    let price: undefined | string
    let priceAuxLimit: undefined | string

    switch (type) {

      case AlunaOrderTypesEnum.LIMIT:
        requiredParams.rate = rate
        price = rate?.toString()
        break

      case AlunaOrderTypesEnum.STOP_MARKET:
        requiredParams.stopRate = stopRate
        price = stopRate?.toString()
        break

      case AlunaOrderTypesEnum.STOP_LIMIT:
        requiredParams.stopRate = stopRate
        requiredParams.limitRate = limitRate
        price = stopRate?.toString()
        priceAuxLimit = limitRate?.toString()
        break

      default:

    }

    Object.entries(requiredParams).forEach(([key, value]) => {

      if (!value) {

        throw new AlunaError({
          httpStatusCode: 422,
          message: `'${key}' param is required to ${action} ${type} orders`,
          code: AlunaGenericErrorCodes.PARAM_ERROR,
        })

      }

    })

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
