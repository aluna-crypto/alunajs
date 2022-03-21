import { AlunaError } from '../../../lib/core/AlunaError'
import { AlunaFeaturesModeEnum } from '../../../lib/enums/AlunaFeaturesModeEnum'
import { AlunaHttpVerbEnum } from '../../../lib/enums/AlunaHtttpVerbEnum'
import { AlunaOrderStatusEnum } from '../../../lib/enums/AlunaOrderStatusEnum'
import { AlunaAccountsErrorCodes } from '../../../lib/errors/AlunaAccountsErrorCodes'
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
import { PoloniexOrderSideAdapter } from '../enums/adapters/PoloniexOrderSideAdapter'
import { PoloniexOrderTimeInForceEnum } from '../enums/PoloniexOrderTimeInForceEnum'
import { PoloniexHttp } from '../PoloniexHttp'
import { PoloniexLog } from '../PoloniexLog'
import {
  PoloniexSpecs,
  PROD_POLONIEX_URL,
} from '../PoloniexSpecs'
import {
  IPoloniexOrderCanceledResponse,
  IPoloniexOrderResponse,
} from '../schemas/IPoloniexOrderSchema'
import { PoloniexOrderReadModule } from './PoloniexOrderReadModule'



export class PoloniexOrderWriteModule extends PoloniexOrderReadModule implements IAlunaOrderWriteModule {

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

      const accountSpecs = PoloniexSpecs.accounts.find(
        (a) => a.type === account,
      )

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
              `Account type '${account}' not supported/implemented for Poloniex`,
          code: AlunaAccountsErrorCodes.TYPE_NOT_SUPPORTED,
        })

      }

      const orderType = orderTypes.find((o) => o.type === type)

      if (!orderType || !orderType.implemented || !orderType.supported) {

        throw new AlunaError({
          message: `Order type '${type}' not supported/implemented for Poloniex`,
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

      PoloniexLog.error(error)

      throw error

    }

    const translatedOrderType = PoloniexOrderSideAdapter.translateToPoloniex({
      side,
    })

    apiRequestCount += 1

    if (!rate) {

      throw new AlunaError({
        message: 'A rate is required for limit orders',
        code: AlunaGenericErrorCodes.PARAM_ERROR,
        httpStatusCode: 401,
      })

    }

    const timestamp = new Date().getTime()
    const body = new URLSearchParams()

    body.append('command', translatedOrderType)
    body.append('currencyPair', symbolPair)
    body.append('amount', amount.toString())
    body.append('rate', rate.toString())
    body.append(PoloniexOrderTimeInForceEnum.POST_ONLY, '1')
    body.append('nonce', timestamp.toString())

    PoloniexLog.info('placing new order for Poloniex')

    let placedOrder: IPoloniexOrderResponse

    try {

      const {
        data: orderRequest,
        apiRequestCount: requestCount,
      } = await PoloniexHttp
        .privateRequest<IPoloniexOrderResponse>({
          url: `${PROD_POLONIEX_URL}/tradingApi`,
          body,
          keySecret: this.exchange.keySecret,
        })

      apiRequestCount += requestCount
      placedOrder = orderRequest

    } catch (err) {

      throw new AlunaError({
        ...err,
        code: AlunaOrderErrorCodes.PLACE_FAILED,
      })

    }

    const { orderNumber, currencyPair } = placedOrder

    const {
      order,
      apiRequestCount: getCount,
    } = await this.get({
      id: orderNumber,
      symbolPair: currencyPair,
    })

    const totalApiRequestCount = apiRequestCount + getCount

    return {
      order,
      apiRequestCount: totalApiRequestCount,
    }

  }



  public async cancel (
    params: IAlunaOrderGetParams,
  ): Promise<IAlunaOrderGetReturns> {

    PoloniexLog.info('canceling order for Poloniex')

    const {
      id,
      symbolPair,
    } = params

    let apiRequestCount = 0

    const {
      order: parsedOrder,
      apiRequestCount: getCount,
    } = await this.get({
      id,
      symbolPair,
    })

    apiRequestCount += 1

    const timestamp = new Date().getTime()
    const body = new URLSearchParams()

    body.append('command', 'cancelOrder')
    body.append('orderNumber', id)
    body.append('nonce', timestamp.toString())

    try {

      const { apiRequestCount: requestCount } = await PoloniexHttp
        .privateRequest<IPoloniexOrderCanceledResponse>(
          {
            verb: AlunaHttpVerbEnum.POST,
            url: `${PROD_POLONIEX_URL}/tradingApi`,
            body,
            keySecret: this.exchange.keySecret,
          },
        )

      apiRequestCount += requestCount

    } catch (err) {

      const error = new AlunaError({
        message: 'Something went wrong, order not canceled',
        httpStatusCode: err.httpStatusCode,
        code: AlunaOrderErrorCodes.CANCEL_FAILED,
        metadata: err.metadata,
      })

      PoloniexLog.error(error)

      throw error

    }

    // Poloniex doesn't return canceled/closed orders
    parsedOrder.status = AlunaOrderStatusEnum.CANCELED

    const totalApiRequestCount = apiRequestCount + getCount

    return {
      order: parsedOrder,
      apiRequestCount: totalApiRequestCount,
    }

  }


  public async edit (
    params: IAlunaOrderEditParams,
  ): Promise<IAlunaOrderEditReturns> {


    PoloniexLog.info('editing order for Poloniex')

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

    const {
      order: newOrder,
      apiRequestCount: placeCount,
    } = await this.place({
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
