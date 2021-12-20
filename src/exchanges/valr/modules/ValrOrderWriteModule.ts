import { AlunaError } from '../../../lib/core/AlunaError'
import { AlunaFeaturesModeEnum } from '../../../lib/enums/AlunaFeaturesModeEnum'
import { AlunaHttpVerbEnum } from '../../../lib/enums/AlunaHtttpVerbEnum'
import {
  IAlunaOrderCancelParams,
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
          data: {
            error: `Account type '${account}' not found`,
          },
        })

      }

      const {
        supported,
        implemented,
        orderTypes: supportedOrderTypes,
      } = accountSpecs

      if (!supported || !implemented || !supportedOrderTypes) {

        throw new AlunaError({
          data: {
            error:
              `Account type '${account}' not supported/implemented for Varl`,
          },
        })

      }

      const orderType = supportedOrderTypes.find((o) => o.type === type)

      if (!orderType || !orderType.implemented || !orderType.supported) {

        throw new AlunaError({
          data: {
            error: `Order type '${type}' not supported/implemented for Varl`,
          },
        })

      }

      if (orderType.mode === AlunaFeaturesModeEnum.READ) {

        throw new AlunaError({
          data: {
            error: `Order type '${type}' is in read mode`,
          },
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

      throw new AlunaError({
        statusCode: 200,
        data: {
          error: meta.failedReason,
        },
      })

    }

    return order

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
        statusCode: 500,
        data: {
          error: 'Something went wrong, order not canceled',
        },
      })

      ValrLog.error(error)

      throw error

    }

    const parsedOrder = this.parse({ rawOrder })

    return parsedOrder

  }

}
