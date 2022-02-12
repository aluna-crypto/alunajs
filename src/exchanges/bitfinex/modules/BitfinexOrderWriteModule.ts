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
  IAlunaOrderCancelParams,
  IAlunaOrderEditParams,
  IAlunaOrderPlaceParams,
  IAlunaOrderWriteModule,
} from '../../../lib/modules/IAlunaOrderModule'
import { IAlunaOrderSchema } from '../../../lib/schemas/IAlunaOrderSchema'
import { BitfinexHttp } from '../BitfinexHttp'
import { BitfinexLog } from '../BitfinexLog'
import { BitfinexSpecs } from '../BitfinexSpecs'
import { BitfinexOrderTypeAdapter } from '../enums/adapters/BitfinexOrderTypeAdapter'
import { BitfinexSideAdapter } from '../enums/adapters/BitfinexSideAdapter'
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
  id?: string | number
}



export class BitfinexOrderWriteModule extends BitfinexOrderReadModule implements IAlunaOrderWriteModule {

  public async place (
    params: IAlunaOrderPlaceParams,
  ): Promise<IAlunaOrderSchema> {

    const {
      type,
      account,
    } = params

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

      const response = await privateRequest<TBitfinexPlaceOrderResponse>({
        url: 'https://api.bitfinex.com/v2/auth/w/order/submit',
        body,
        keySecret: this.exchange.keySecret,
      })

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

      let {
        code,
        httpStatusCode,
      } = err

      if (/not enough.+balance/i.test(err.message)) {

        code = AlunaBalanceErrorCodes.INSUFFICIENT_BALANCE
        httpStatusCode = 400

      }

      const error = new AlunaError({
        message: err.message,
        code,
        httpStatusCode,
        metadata: err.metadata,
      })

      BitfinexLog.error(error)

      throw error

    }

    const parsedOrder = await this.parse({ rawOrder })

    return parsedOrder

  }

  async edit (params: IAlunaOrderEditParams): Promise<IAlunaOrderSchema> {

    const {
      type,
      account,
    } = params

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

      const response = await privateRequest<TBitfinexEditCancelOrderResponse>({
        url: 'https://api.bitfinex.com/v2/auth/w/order/update',
        body,
        keySecret: this.exchange.keySecret,
      })

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
        metadata: err.metadata,
        httpStatusCode: err.httpStatusCode,
      })

      BitfinexLog.error(error)

      throw error

    }

    return this.parse({ rawOrder })

  }

  public async cancel (
    params: IAlunaOrderCancelParams,
  ): Promise<IAlunaOrderSchema> {

    const { id } = params

    BitfinexLog.info('canceling order for Bitfinex')

    const { privateRequest } = BitfinexHttp

    try {

      const response = await privateRequest<TBitfinexPlaceOrderResponse>({
        url: 'https://api.bitfinex.com/v2/auth/w/order/cancel',
        body: { id },
        keySecret: this.exchange.keySecret,
      })

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

    return this.get(params)

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

    const translatedAmount = BitfinexSideAdapter.translateToBitfinex({
      amount: Number(amount),
      side,
    })

    const requiredParams: Record<string, any> = {}

    let price: number | undefined | string
    let priceAuxLimit: number | undefined | string

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
          httpStatusCode: 200,
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

      Object.assign(body, { id })

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
