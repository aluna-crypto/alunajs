import { AlunaError } from '../../../lib/core/AlunaError'
import { AlunaFeaturesModeEnum } from '../../../lib/enums/AlunaFeaturesModeEnum'
import { AlunaHttpVerbEnum } from '../../../lib/enums/AlunaHtttpVerbEnum'
import { AlunaAccountsErrorCodes } from '../../../lib/errors/AlunaAccountsErrorCodes'
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
import { GateioOrderSideAdapter } from '../enums/adapters/GateioOrderSideAdapter'
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

    if (!rate) {

      throw new AlunaError({
        message: 'A rate is required for limit orders',
        code: AlunaOrderErrorCodes.PLACE_FAILED,
        httpStatusCode: 401,
      })

    }

    const body: IGateioOrderRequest = {
      side: GateioOrderSideAdapter.translateToGateio({ from: side }),
      currency_pair: symbolPair,
      amount: amount.toString(),
      price: rate.toString(),
    }

    apiRequestCount += 1

    GateioLog.info('placing new order for Gateio')

    let placedOrder: IGateioOrderSchema

    try {

      const {
        apiRequestCount: requestCount,
        data: orderResponse,
      } = await GateioHttp
        .privateRequest<IGateioOrderSchema>({
          url: `${PROD_GATEIO_URL}/spot/orders`,
          body,
          keySecret: this.exchange.keySecret,
        })

      placedOrder = orderResponse
      apiRequestCount += requestCount

    } catch (err) {

      throw new AlunaError({
        ...err,
        code: AlunaOrderErrorCodes.PLACE_FAILED,
      })

    }

    const { order, apiRequestCount: parseCount } = await this.parse({
      rawOrder: placedOrder,
    })

    const totalApiRequestCount = apiRequestCount + parseCount

    return {
      order,
      apiRequestCount: totalApiRequestCount,
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
    let apiRequestCount = 0

    const query = new URLSearchParams()

    query.append('currency_pair', symbolPair)

    try {

      const {
        data: cancelOrderResponse,
        apiRequestCount: requestCount,
      } = await GateioHttp.privateRequest<IGateioOrderSchema>(
        {
          verb: AlunaHttpVerbEnum.DELETE,
          url: `${PROD_GATEIO_URL}/spot/orders/${id}?${query.toString()}`,
          keySecret: this.exchange.keySecret,
        },
      )

      canceledOrder = cancelOrderResponse
      apiRequestCount += requestCount

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
      apiRequestCount: parseCount,
    } = await this.parse({ rawOrder: canceledOrder })

    const totalApiRequestCount = apiRequestCount + parseCount

    return {
      order,
      apiRequestCount: totalApiRequestCount,
    }

  }



  public async edit (
    params: IAlunaOrderEditParams,
  ): Promise<IAlunaOrderEditReturns> {

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

    let apiRequestCount = 0

    const { apiRequestCount: cancelCount } = await this.cancel({
      id,
      symbolPair,
    })

    apiRequestCount += 1

    const { order: newOrder, apiRequestCount: placeCount } = await this.place({
      rate,
      side,
      type,
      amount,
      account,
      symbolPair,
    })

    apiRequestCount += 1

    const totalApiRequestCount = apiRequestCount
      + cancelCount
      + placeCount

    return {
      order: newOrder,
      apiRequestCount: totalApiRequestCount,
    }

  }

}
