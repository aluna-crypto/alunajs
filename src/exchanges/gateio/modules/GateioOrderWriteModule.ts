import { assign } from 'lodash'

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
import { GateioOrderSideAdapter } from '../enums/adapters/GateioOrderSideAdapter'
import { Gateio } from '../Gateio'
import { GateioHttp } from '../GateioHttp'
import { GateioLog } from '../GateioLog'
import {
  GateioSpecs,
  PROD_GATEIO_URL,
} from '../GateioSpecs'
import {
  IGateioOrderRequest,
  IGateioOrderSchema,
} from '../schemas/IGateioOrderSchema'
import { GateioOrderReadModule } from './GateioOrderReadModule'



export class GateioOrderWriteModule extends GateioOrderReadModule implements IAlunaOrderWriteModule {

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

      const accountSpecs = GateioSpecs.accounts.find((a) => a.type === account)

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
                `Account type '${account}' not supported/implemented for Gateio`,
          code: AlunaAccountsErrorCodes.TYPE_NOT_SUPPORTED,
        })

      }

      const orderType = orderTypes.find((o) => o.type === type)

      if (!orderType || !orderType.implemented || !orderType.supported) {

        throw new AlunaError({
          message: `Order type '${type}' not supported/implemented for Gateio`,
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

      GateioLog.error(error)

      throw error

    }

    const body: IGateioOrderRequest = {
      side: GateioOrderSideAdapter.translateToGateio({ from: side }),
      currency_pair: symbolPair,
      amount: amount.toString(),
      price: rate!.toString(),
    }

    const { orderAnnotation } = Gateio.settings

    if (orderAnnotation) {

      assign(body, { text: orderAnnotation })

    }

    GateioLog.info('placing new order for Gateio')

    let placedOrder: IGateioOrderSchema

    try {

      const {
        requestCount: privateRequestCount,
        data: orderResponse,
      } = await GateioHttp
        .privateRequest<IGateioOrderSchema>({
          url: `${PROD_GATEIO_URL}/spot/orders`,
          body,
          keySecret: this.exchange.keySecret,
        })

      placedOrder = orderResponse
      requestCount += privateRequestCount

    } catch (err) {

      const error = new AlunaError({
        ...err,
        code: AlunaOrderErrorCodes.PLACE_FAILED,
      })

      const INSUFFICIENT_BALANCE_LABEL = 'BALANCE_NOT_ENOUGH'

      const isInsufficientBalanceError = error.metadata.label
        === INSUFFICIENT_BALANCE_LABEL

      if (isInsufficientBalanceError) {

        error.code = AlunaBalanceErrorCodes.INSUFFICIENT_BALANCE

      }

      throw error

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

    GateioLog.info('canceling order for Gateio')

    const {
      id,
      symbolPair,
    } = params

    let canceledOrder: IGateioOrderSchema
    let requestCount = 0

    const query = new URLSearchParams()

    query.append('currency_pair', symbolPair)

    try {

      const {
        data: cancelOrderResponse,
        requestCount: privateRequestCount,
      } = await GateioHttp.privateRequest<IGateioOrderSchema>(
        {
          verb: AlunaHttpVerbEnum.DELETE,
          url: `${PROD_GATEIO_URL}/spot/orders/${id}?${query.toString()}`,
          keySecret: this.exchange.keySecret,
        },
      )

      canceledOrder = cancelOrderResponse
      requestCount += privateRequestCount

    } catch (err) {

      const { httpStatusCode, metadata } = err

      const error = new AlunaError({
        message: 'Something went wrong, order not canceled',
        httpStatusCode,
        code: AlunaOrderErrorCodes.CANCEL_FAILED,
        metadata,
      })

      GateioLog.error(error)

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

    GateioLog.info('editing order for Gateio')

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

    const { order: newOrder, requestCount: placeCount } = await this.place({
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
