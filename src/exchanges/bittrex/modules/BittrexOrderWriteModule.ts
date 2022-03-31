import { AlunaError } from '../../../lib/core/AlunaError'
import { AlunaFeaturesModeEnum } from '../../../lib/enums/AlunaFeaturesModeEnum'
import { AlunaHttpVerbEnum } from '../../../lib/enums/AlunaHtttpVerbEnum'
import { AlunaAccountsErrorCodes } from '../../../lib/errors/AlunaAccountsErrorCodes'
import { AlunaBalanceErrorCodes } from '../../../lib/errors/AlunaBalanceErrorCodes'
import { AlunaGenericErrorCodes } from '../../../lib/errors/AlunaGenericErrorCodes'
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
import { BittrexHttp } from '../BittrexHttp'
import { BittrexLog } from '../BittrexLog'
import {
  BittrexSpecs,
  PROD_BITTREX_URL,
} from '../BittrexSpecs'
import { BittrexOrderSideAdapter } from '../enums/adapters/BittrexOrderSideAdapter'
import { BittrexOrderTypeAdapter } from '../enums/adapters/BittrexOrderTypeAdapter'
import { BittrexOrderTimeInForceEnum } from '../enums/BittrexOrderTimeInForceEnum'
import { BittrexOrderTypeEnum } from '../enums/BittrexOrderTypeEnum'
import {
  IBittrexOrderRequest,
  IBittrexOrderSchema,
} from '../schemas/IBittrexOrderSchema'
import { BittrexOrderReadModule } from './BittrexOrderReadModule'



export class BittrexOrderWriteModule extends BittrexOrderReadModule implements IAlunaOrderWriteModule {

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

      const accountSpecs = BittrexSpecs.accounts.find((a) => a.type === account)

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
              `Account type '${account}' not supported/implemented for Bittrex`,
          code: AlunaAccountsErrorCodes.TYPE_NOT_SUPPORTED,
        })

      }

      const orderType = orderTypes.find((o) => o.type === type)

      if (!orderType || !orderType.implemented || !orderType.supported) {

        throw new AlunaError({
          message: `Order type '${type}' not supported/implemented for Bittrex`,
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

      BittrexLog.error(error)

      throw error

    }

    const translatedOrderType = BittrexOrderTypeAdapter.translateToBittrex({
      from: type,
    })

    const body: IBittrexOrderRequest = {
      direction: BittrexOrderSideAdapter.translateToBittrex({ from: side }),
      marketSymbol: symbolPair,
      type: translatedOrderType,
      quantity: Number(amount),
    }

    if (translatedOrderType === BittrexOrderTypeEnum.LIMIT) {

      Object.assign(body, {
        limit: Number(rate),
        timeInForce: BittrexOrderTimeInForceEnum.GOOD_TIL_CANCELLED,
      })

    } else {

      Object.assign(body, {
        timeInForce: BittrexOrderTimeInForceEnum.FILL_OR_KILL,
      })

    }

    BittrexLog.info('placing new order for Bittrex')

    let placedOrder: IBittrexOrderSchema

    try {

      const {
        requestCount: privateRequestCount,
        data: orderResponse,
      } = await BittrexHttp
        .privateRequest<IBittrexOrderSchema>({
          url: `${PROD_BITTREX_URL}/orders`,
          body,
          keySecret: this.exchange.keySecret,
        })

      placedOrder = orderResponse
      requestCount += privateRequestCount

    } catch (err) {

      let {
        code,
        message,
      } = err

      const { metadata } = err

      if (metadata.code === 'INSUFFICIENT_FUNDS') {

        code = AlunaBalanceErrorCodes.INSUFFICIENT_BALANCE

        message = 'Account has insufficient balance for requested action.'

      } else if (metadata.code === 'DUST_TRADE_DISALLOWED_MIN_VALUE') {

        code = AlunaGenericErrorCodes.UNKNOWN

        message = 'The amount of quote currency involved in a transaction '
          .concat('would be less than the minimum limit of 10K satoshis')

      } else if (metadata.code === 'MIN_TRADE_REQUIREMENT_NOT_MET') {

        code = AlunaOrderErrorCodes.PLACE_FAILED

        message = 'The trade was smaller than the min trade size quantity for '
          .concat('the market')

      }

      throw new AlunaError({
        ...err,
        code,
        message,
      })

    }

    const { order, requestCount: parseCount } = await this.parse({
      rawOrder: placedOrder,
    })

    const totalRequestCount = requestCount + parseCount

    return {
      order,
      requestCount: totalRequestCount,
    }

  }



  public async cancel (
    params: IAlunaOrderGetParams,
  ): Promise<IAlunaOrderGetReturns> {

    BittrexLog.info('canceling order for Bittrex')

    const {
      id,
    } = params

    let canceledOrder: IBittrexOrderSchema
    let requestCount = 0

    try {

      const {
        data: cancelOrderResponse,
        requestCount: privateRequestCount,
      } = await BittrexHttp.privateRequest<IBittrexOrderSchema>(
        {
          verb: AlunaHttpVerbEnum.DELETE,
          url: `${PROD_BITTREX_URL}/orders/${id}`,
          keySecret: this.exchange.keySecret,
        },
      )

      canceledOrder = cancelOrderResponse
      requestCount += privateRequestCount

    } catch (err) {

      const { metadata, httpStatusCode } = err

      const error = new AlunaError({
        message: 'Something went wrong, order not canceled',
        httpStatusCode,
        code: AlunaOrderErrorCodes.CANCEL_FAILED,
        metadata,
      })

      BittrexLog.error(error)

      throw error

    }

    const {
      order,
      requestCount: parseCount,
    } = await this.parse({ rawOrder: canceledOrder })

    const totalRequestCount = requestCount + parseCount

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

    BittrexLog.info('editing order for Bittrex')

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

    const { requestCount: cancelCount } = await this.cancel({
      id,
      symbolPair,
    })

    const {
      order: newOrder,
      requestCount: placeCount,
    } = await this.place({
      rate,
      side,
      type,
      amount,
      account,
      symbolPair,
    })

    const totalRequestCount = requestCount
      + cancelCount
      + placeCount

    return {
      order: newOrder,
      requestCount: totalRequestCount,
    }

  }

}
