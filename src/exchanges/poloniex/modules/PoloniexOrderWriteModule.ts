import { AlunaError } from '../../../lib/core/AlunaError'
import { AlunaFeaturesModeEnum } from '../../../lib/enums/AlunaFeaturesModeEnum'
import { AlunaHttpVerbEnum } from '../../../lib/enums/AlunaHtttpVerbEnum'
import { AlunaOrderStatusEnum } from '../../../lib/enums/AlunaOrderStatusEnum'
import { AlunaAccountsErrorCodes } from '../../../lib/errors/AlunaAccountsErrorCodes'
import { AlunaBalanceErrorCodes } from '../../../lib/errors/AlunaBalanceErrorCodes'
import { AlunaOrderErrorCodes } from '../../../lib/errors/AlunaOrderErrorCodes'
import {
  IAlunaOrderCancelParams,
  IAlunaOrderEditParams,
  IAlunaOrderPlaceParams,
  IAlunaOrderWriteModule,
} from '../../../lib/modules/IAlunaOrderModule'
import { IAlunaOrderSchema } from '../../../lib/schemas/IAlunaOrderSchema'
import { editOrderParamsSchema } from '../../../utils/validation/schemas/editOrderParamsSchema'
import { placeOrderParamsSchema } from '../../../utils/validation/schemas/placeOrderParamsSchema'
import { validateParams } from '../../../utils/validation/validateParams'
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
  ): Promise<IAlunaOrderSchema> {

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

    const timestamp = new Date().getTime()
    const body = new URLSearchParams()

    body.append('command', translatedOrderType)
    body.append('currencyPair', symbolPair)
    body.append('amount', amount.toString())
    body.append('rate', rate!.toString())
    body.append(PoloniexOrderTimeInForceEnum.POST_ONLY, '1')
    body.append('nonce', timestamp.toString())

    PoloniexLog.info('placing new order for Poloniex')

    let placedOrder: IPoloniexOrderResponse

    try {

      placedOrder = await PoloniexHttp
        .privateRequest<IPoloniexOrderResponse>({
          url: `${PROD_POLONIEX_URL}/tradingApi`,
          body,
          keySecret: this.exchange.keySecret,
        })

    } catch (err) {

      const error = new AlunaError({
        ...err,
        code: AlunaOrderErrorCodes.PLACE_FAILED,
      })

      const isInsufficientBalanceError = err.message.includes('Not enough')

      if (isInsufficientBalanceError) {

        error.code = AlunaBalanceErrorCodes.INSUFFICIENT_BALANCE

      }

      throw error

    }

    const { orderNumber, currencyPair } = placedOrder

    const order = await this.get({
      id: orderNumber,
      symbolPair: currencyPair,
    })

    return order

  }



  public async cancel (
    params: IAlunaOrderCancelParams,
  ): Promise<IAlunaOrderSchema> {

    PoloniexLog.info('canceling order for Poloniex')

    const {
      id,
      symbolPair,
    } = params

    const parsedOrder = await this.get({
      id,
      symbolPair,
    })

    const timestamp = new Date().getTime()
    const body = new URLSearchParams()

    body.append('command', 'cancelOrder')
    body.append('orderNumber', id)
    body.append('nonce', timestamp.toString())

    try {

      await PoloniexHttp.privateRequest<IPoloniexOrderCanceledResponse>(
        {
          verb: AlunaHttpVerbEnum.POST,
          url: `${PROD_POLONIEX_URL}/tradingApi`,
          body,
          keySecret: this.exchange.keySecret,
        },
      )

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

    return parsedOrder

  }


  public async edit (
    params: IAlunaOrderEditParams,
  ): Promise<IAlunaOrderSchema> {

    validateParams({
      params,
      schema: editOrderParamsSchema,
    })

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
