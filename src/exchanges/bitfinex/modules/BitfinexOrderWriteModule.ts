import {
  AlunaHttpErrorCodes,
  AlunaOrderTypesEnum,
} from '../../..'
import { AlunaError } from '../../../lib/core/AlunaError'
import { AlunaFeaturesModeEnum } from '../../../lib/enums/AlunaFeaturesModeEnum'
import { AlunaAccountsErrorCodes } from '../../../lib/errors/AlunaAccountsErrorCodes'
import { AlunaAdaptersErrorCodes } from '../../../lib/errors/AlunaAdaptersErrorCodes'
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

export class BitfinexOrderWriteModule extends BitfinexOrderReadModule implements IAlunaOrderWriteModule {

  public async place (
    params: IAlunaOrderPlaceParams,
  ): Promise<IAlunaOrderSchema> {

    const {
      amount,
      symbolPair,
      side,
      type,
      account,
      rate,
      limitRate,
      stopRate,
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

    const translatedAmount = BitfinexSideAdapter.translateToBitfinex({
      amount: Number(amount),
      side,
    })

    const translatedOrderType = BitfinexOrderTypeAdapter.translateToBitfinex({
      account,
      from: type,
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
          message: `'${key}' param is required for placing new '${type}' orders`,
          code: AlunaGenericErrorCodes.PARAM_ERROR,
        })

      }

    })

    const body = {
      symbol: symbolPair,
      type: translatedOrderType,
      amount: translatedAmount,
      price,
      price_aux_limit: priceAuxLimit,
    }

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
          code: AlunaHttpErrorCodes.REQUEST_ERROR,
          message: text,
          httpStatusCode: 500,
        })

      }

      rawOrder = placedOrder

    } catch (err) {

      let {
        code,
        httpStatusCode,
      } = err

      if (/not enough.+balance/.test(err.message)) {

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

    const parsedOrder = this.parse({ rawOrder })

    return parsedOrder

  }

  async edit (params: IAlunaOrderEditParams): Promise<IAlunaOrderSchema> {

    BitfinexLog.info('editing order for Bitfinex')

    return params as any

  }

  public async cancel (
    params: IAlunaOrderCancelParams,
  ): Promise<IAlunaOrderSchema> {

    BitfinexLog.info('canceling order for Bitfinex')

    return params as any

  }

}
