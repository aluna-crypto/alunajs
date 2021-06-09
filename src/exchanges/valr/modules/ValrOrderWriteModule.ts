import { HttpVerbEnum } from '../../../lib/enums/HtttpVerbEnum'
import {
  IAlunaOrderCancelParams,
  IAlunaOrderPlaceParams,
  IAlunaOrderWriteModule,
} from '../../../lib/modules/IAlunaOrderModule'
import { IAlunaExchangeOrderTypesSpecsSchema } from '../../../lib/schemas/IAlunaExchangeSpecsSchema'
import { IAlunaOrderSchema } from '../../../lib/schemas/IAlunaOrderSchema'
import { ValrOrderTypeAdapter } from '../enums/adapters/ValrOrderTypeAdapter'
import { ValrSideAdapter } from '../enums/adapters/ValrSideAdapter'
import { ValrOrderStatusEnum } from '../enums/ValrOrderStatusEnum'
import { ValrOrderTimeInForceEnum } from '../enums/ValrOrderTimeInForceEnum'
import { ValrOrderTypesEnum } from '../enums/ValrOrderTypesEnum'
import { ValrOrderParser } from '../schemas/parsers/ValrOrderParser'
import { ValrError } from '../ValrError'
import { ValrHttp } from '../ValrHttp'
import { ValrSpecs } from '../ValrSpecs'
import { ValrOrderReadModule } from './ValrOrderReadModule'



interface IValrPlaceOrderResponse {
  id: string
}



export class ValrOrderWriteModule extends ValrOrderReadModule implements IAlunaOrderWriteModule {

  async place (params: IAlunaOrderPlaceParams): Promise<IAlunaOrderSchema> {

    const {
      amount,
      rate,
      symbolPair,
      side,
      type,
      account,
    } = params

    let supported: boolean
    let implemented: boolean | undefined
    let supportedOrderTypes: IAlunaExchangeOrderTypesSpecsSchema | undefined

    try {

      ({
        supported,
        implemented,
        orderTypes: supportedOrderTypes,
      } = ValrSpecs.accounts[account])

    } catch (error) {

      throw new ValrError({
        message: `Account type ${account} does not exists in Valr specs`,
      })

    }

    if (!supported || !implemented || !supportedOrderTypes) {

      throw new ValrError({
        message: `Account type ${account} not supported/implemented for Varl`,
      })

    }

    const orderType = supportedOrderTypes[type]

    if (!orderType || !orderType.implemented || !orderType.supported) {

      throw new ValrError({
        message: `Order type ${type} not supported/implemented for Varl`,
      })

    }

    const body = {
      side: ValrSideAdapter.translateToValr({ side }),
      pair: symbolPair,
    }

    const translatedOrderType = ValrOrderTypeAdapter.translateToValr({ type })

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

    const { id } = await ValrHttp.privateRequest<IValrPlaceOrderResponse>({
      url: `https://api.valr.com/v1/orders/${translatedOrderType}`,
      body,
      keySecret: this.exchange.keySecret,
    })

    return this.get({
      id,
      symbolPair,
    })

  }



  async cancel (params: IAlunaOrderCancelParams): Promise<IAlunaOrderSchema> {

    await ValrHttp.privateRequest<void>({
      verb: HttpVerbEnum.DELETE,
      url: 'https://api.valr.com/v1/orders/order',
      keySecret: this.exchange.keySecret,
      body: {
        orderId: params.id,
        pair: params.symbolPair,
      },
    })

    const ensuredCancelled = await this.getRaw(params)

    if (ensuredCancelled.orderStatusType !== ValrOrderStatusEnum.CANCELLED) {

      throw new ValrError({
        message: 'Something went wrong, order not canceled',
        statusCode: 500,
      })

    }

    return ValrOrderParser.parse({
      rawOrder: ensuredCancelled,
    })

  }

}
