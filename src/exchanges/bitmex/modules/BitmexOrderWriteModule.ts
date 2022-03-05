import { AlunaError } from '../../../lib/core/AlunaError'
import { AlunaAccountEnum } from '../../../lib/enums/AlunaAccountEnum'
import { AlunaFeaturesModeEnum } from '../../../lib/enums/AlunaFeaturesModeEnum'
import { AlunaHttpVerbEnum } from '../../../lib/enums/AlunaHtttpVerbEnum'
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
import { BitmexHttp } from '../BitmexHttp'
import { BitmexLog } from '../BitmexLog'
import {
  BitmexSpecs,
  PROD_BITMEX_URL,
} from '../BitmexSpecs'
import { BitmexOrderSideAdapter } from '../enums/adapters/BitmexOrderSideAdapter'
import { BitmexOrderTypeAdapter } from '../enums/adapters/BitmexOrderTypeAdapter'
import { BitmexOrderTypeEnum } from '../enums/BitmexOrderTypeEnum'
import { IBitmexOrderSchema } from '../schemas/IBitmexOrderSchema'
import { BitmexOrderParser } from '../schemas/parsers/BitmexOrderParser'
import { BitmexMarketModule } from './BitmexMarketModule'
import { BitmexOrderReadModule } from './BitmexOrderReadModule'



interface IAssembleBodyRequestParams extends IAlunaOrderPlaceParams {
  id?: string
}

interface IBitmexOrderResponse extends IBitmexOrderSchema {
  error: string
}



export class BitmexOrderWriteModule extends BitmexOrderReadModule implements IAlunaOrderWriteModule {

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

    const body = await this.assembleBodyRequest({
      orderParams: params,
    })

    BitmexLog.info('placing new order for Bitmex')

    const { privateRequest } = BitmexHttp

    let rawOrder: IBitmexOrderSchema

    try {

      rawOrder = await privateRequest<IBitmexOrderSchema>({
        url: `${PROD_BITMEX_URL}/order`,
        body,
        keySecret: this.exchange.keySecret,
        verb: AlunaHttpVerbEnum.POST,
      })


    } catch (error) {

      this.handleError({ error })

    }

    rawOrder = await this.getFreshOrder({ rawOrder })

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

    const body = await this.assembleBodyRequest({
      orderParams: params,
    })

    BitmexLog.info('editing order for Bitmex')

    const { privateRequest } = BitmexHttp

    let rawOrder: IBitmexOrderSchema

    try {

      rawOrder = await privateRequest<IBitmexOrderSchema>({
        url: `${PROD_BITMEX_URL}/order`,
        body,
        keySecret: this.exchange.keySecret,
        verb: AlunaHttpVerbEnum.PUT,
      })

    } catch (error) {

      this.handleError({ error })

    }

    rawOrder = await this.getFreshOrder({ rawOrder })

    const parsedOrder = await this.parse({ rawOrder })

    return parsedOrder

  }

  public async cancel (
    params: IAlunaOrderCancelParams,
  ): Promise<IAlunaOrderSchema> {

    const { id } = params

    BitmexLog.info('canceling order for Bitmex')

    const { privateRequest } = BitmexHttp

    let rawOrder: IBitmexOrderResponse

    try {

      [rawOrder] = await privateRequest<IBitmexOrderResponse[]>({
        url: `${PROD_BITMEX_URL}/order`,
        body: { orderID: id },
        keySecret: this.exchange.keySecret,
        verb: AlunaHttpVerbEnum.DELETE,
      })

      if (rawOrder.error) {

        const error = new AlunaError({
          code: AlunaHttpErrorCodes.REQUEST_ERROR,
          message: rawOrder.error,
        })

        this.handleError({ error })

      }

    } catch (error) {

      this.handleError({ error })

    }

    return this.parse({ rawOrder })

  }

  private async assembleBodyRequest (params: {
    orderParams: IAssembleBodyRequestParams,
  }): Promise<Record<string, any>> {

    const { orderParams } = params

    const {
      id,
      amount,
      symbolPair,
      side,
      type,
      rate,
      limitRate,
      stopRate,
    } = orderParams

    const action = orderParams.id
      ? 'edit'
      : 'place'

    const ordType = BitmexOrderTypeAdapter.translateToBitmex({
      from: type,
    })

    const translatedSide = BitmexOrderSideAdapter.translateToBitmex({
      from: side,
    })

    const { instrument } = await BitmexMarketModule.get({
      symbolPair,
    })

    const orderQty = BitmexOrderParser.translateAmountToOrderQty({
      amount,
      instrument: instrument!,
    })

    const requiredPriceParams: Record<string, any> = {}

    let price: number | undefined
    let stopPx: number | undefined

    switch (ordType) {

      case BitmexOrderTypeEnum.LIMIT:
        requiredPriceParams.rate = rate
        price = rate
        break

      case BitmexOrderTypeEnum.STOP_MARKET:
        requiredPriceParams.stopRate = stopRate
        stopPx = stopRate
        break

      case BitmexOrderTypeEnum.STOP_LIMIT:
        requiredPriceParams.stopRate = stopRate
        requiredPriceParams.limitRate = limitRate
        stopPx = stopRate
        price = limitRate
        break

      default:

    }

    Object.entries(requiredPriceParams).forEach(([key, value]) => {

      if (!value) {

        const error = new AlunaError({
          httpStatusCode: 200,
          message: `'${key}' param is required to ${action} ${type} orders`,
          code: AlunaGenericErrorCodes.PARAM_ERROR,
        })

        this.handleError({ error })

      }

    })

    const body = {
      orderQty,
      ...(price ? { price } : {}),
      ...(stopPx ? { stopPx } : {}),
      text: 'Sent by Aluna',
    }

    if (action === 'place') {

      Object.assign(body, {
        symbol: symbolPair,
        side: translatedSide,
        ordType,
      })

    } else {

      Object.assign(body, { orderID: id! })

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

      const accountSpecs = BitmexSpecs.accounts.find((a) => {

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

      if (!supported || !implemented) {

        throw new AlunaError({
          message: `Account type '${account}' not supported/implemented for ${BitmexSpecs.name}`,
          code: AlunaAccountsErrorCodes.TYPE_NOT_SUPPORTED,
        })

      }

      const orderType = supportedOrderTypes.find((o) => o.type === type)

      if (!orderType || !orderType.implemented || !orderType.supported) {

        throw new AlunaError({
          message: `Order type '${type}' not supported/implemented for ${BitmexSpecs.name}`,
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

      BitmexLog.error(error)

      throw error

    }

  }

  private async getFreshOrder (params: {
    rawOrder: IBitmexOrderSchema,
  }): Promise<IBitmexOrderSchema> {

    let { rawOrder } = params

    const { ordType } = rawOrder

    const isStopLimit = ordType === BitmexOrderTypeEnum.STOP_LIMIT
    const isStopMarket = ordType === BitmexOrderTypeEnum.STOP_MARKET

    const shouldGetFreshOrder = isStopLimit || isStopMarket

    if (shouldGetFreshOrder) {

      const {
        orderID,
        symbol,
      } = rawOrder

      rawOrder = await this.getRaw({
        id: orderID,
        symbolPair: symbol,
      })

    }

    return rawOrder

  }

  private handleError (params: {
    error: AlunaError,
  }): never {

    const { error } = params

    let {
      code,
    } = error

    if (/insufficient Available Balance/i.test(error.message)) {

      code = AlunaBalanceErrorCodes.INSUFFICIENT_BALANCE

    } else if (/Invalid orderID/.test(error.message)) {

      code = AlunaOrderErrorCodes.NOT_FOUND

    }

    const alunaError = new AlunaError({
      code,
      message: error.message,
      metadata: error.metadata,
      httpStatusCode: error.httpStatusCode,
    })

    BitmexLog.error(alunaError)

    throw alunaError

  }

}
