import { AlunaError } from '../../../lib/core/AlunaError'
import { AlunaFeaturesModeEnum } from '../../../lib/enums/AlunaFeaturesModeEnum'
import { AlunaHttpVerbEnum } from '../../../lib/enums/AlunaHtttpVerbEnum'
import { AlunaAccountsErrorCodes } from '../../../lib/errors/AlunaAccountsErrorCodes'
import { AlunaAdaptersErrorCodes } from '../../../lib/errors/AlunaAdaptersErrorCodes'
import { AlunaGenericErrorCodes } from '../../../lib/errors/AlunaGenericErrorCodes'
import { AlunaOrderErrorCodes } from '../../../lib/errors/AlunaOrderErrorCodes'
import {
  IAlunaOrderCancelParams,
  IAlunaOrderEditParams,
  IAlunaOrderPlaceParams,
  IAlunaOrderWriteModule,
} from '../../../lib/modules/IAlunaOrderModule'
import { IAlunaOrderSchema } from '../../../lib/schemas/IAlunaOrderSchema'
import { ValrOrderTypeAdapter } from '../enums/adapters/ValrOrderTypeAdapter'
import { ValrSideAdapter } from '../enums/adapters/ValrSideAdapter'
import { ValrOrderStatusEnum } from '../enums/ValrOrderStatusEnum'
import { ValrOrderTimeInForceEnum } from '../enums/ValrOrderTimeInForceEnum'
import { ValrOrderTypesEnum } from '../enums/ValrOrderTypesEnum'
import { IValrOrderGetSchema } from '../schemas/IValrOrderSchema'
import { ValrHttp } from '../ValrHttp'
import { ValrLog } from '../ValrLog'
import { ValrSpecs } from '../ValrSpecs'
import { ValrOrderReadModule } from './ValrOrderReadModule'



interface IValrPlaceOrderResponse {
  id: string
}

export class ValrOrderWriteModule extends ValrOrderReadModule implements IAlunaOrderWriteModule {

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

      const accountSpecs = ValrSpecs.accounts.find((a) => a.type === account)

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
          message: `Account type '${account}' not supported/implemented for Varl`,
          code: AlunaAccountsErrorCodes.TYPE_NOT_SUPPORTED,
        })

      }

      const orderType = supportedOrderTypes.find((o) => o.type === type)

      if (!orderType || !orderType.implemented || !orderType.supported) {

        throw new AlunaError({
          message: `Order type '${type}' not supported/implemented for Varl`,
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

      ValrLog.error(error)

      throw error

    }

    const body = {
      side: ValrSideAdapter.translateToValr({ from: side }),
      pair: symbolPair,
    }

    const translatedOrderType = ValrOrderTypeAdapter.translateToValr({
      from: type,
    })

    if (translatedOrderType === ValrOrderTypesEnum.LIMIT) {

      if (!rate) {

        throw new AlunaError({
          httpStatusCode: 200,
          message: 'Rate param is required for placing new limit orders',
          code: AlunaGenericErrorCodes.PARAM_ERROR,
        })

      }

      Object.assign(body, {
        quantity: amount,
        price: rate,
        postOnly: false,
        timeInForce: ValrOrderTimeInForceEnum.GOOD_TILL_CANCELLED,
      })

    } else {

      Object.assign(body, {
        baseAmount: amount,
      })

    }

    ValrLog.info('placing new order for valr')

    const { id } = await ValrHttp.privateRequest<IValrPlaceOrderResponse>({
      url: `https://api.valr.com/v1/orders/${translatedOrderType}`,
      body,
      keySecret: this.exchange.keySecret,
    })

    const order = await this.get({
      id,
      symbolPair,
    })

    const meta: IValrOrderGetSchema = (order.meta as IValrOrderGetSchema)

    if (meta.orderStatusType === ValrOrderStatusEnum.FAILED) {

      let code = AlunaOrderErrorCodes.PLACE_FAILED

      if (meta.failedReason === 'Insufficient Balance') {

        code = AlunaOrderErrorCodes.INSUFFICIENT_BALANCE

      }

      throw new AlunaError({
        httpStatusCode: 200,
        message: meta.failedReason,
        code,
      })

    }

    return order

  }

  async edit (params: IAlunaOrderEditParams): Promise<IAlunaOrderSchema> {

    ValrLog.info('editing order for Valr')

    const {
      id,
      rate,
      side,
      type,
      amount,
      account,
      symbolPair,
    } = params

    const rawOrder = await this.getRaw({
      id,
      symbolPair,
    })

    const { orderStatusType } = rawOrder

    let isOrderOpen: boolean

    switch (orderStatusType) {

      case ValrOrderStatusEnum.ACTIVE:
      case ValrOrderStatusEnum.PLACED:
      case ValrOrderStatusEnum.PARTIALLY_FILLED:

        isOrderOpen = true

        break

      default:

        isOrderOpen = false

    }

    if (!isOrderOpen) {

      throw new AlunaError({
        httpStatusCode: 200,
        message: 'Order is not open/active anymore',
        code: AlunaOrderErrorCodes.IS_NOT_OPEN,
      })

    }

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

  public async cancel (
    params: IAlunaOrderCancelParams,
  ): Promise<IAlunaOrderSchema> {

    ValrLog.info('canceling order for Valr')

    const {
      id,
      symbolPair,
    } = params

    const body = {
      orderId: id,
      pair: symbolPair,
    }

    await ValrHttp.privateRequest<void>({
      verb: AlunaHttpVerbEnum.DELETE,
      url: 'https://api.valr.com/v1/orders/order',
      keySecret: this.exchange.keySecret,
      body,
    })

    const rawOrder = await this.getRaw(params)

    if (rawOrder.orderStatusType !== ValrOrderStatusEnum.CANCELLED) {

      const error = new AlunaError({
        httpStatusCode: 500,
        message: 'Something went wrong, order not canceled',
        code: AlunaOrderErrorCodes.CANCEL_FAILED,
      })

      ValrLog.error(error)

      throw error

    }

    const parsedOrder = this.parse({ rawOrder })

    return parsedOrder

  }

}
