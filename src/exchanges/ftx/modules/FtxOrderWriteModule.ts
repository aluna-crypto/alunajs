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
import { FtxOrderTypeAdapter } from '../enums/adapters/FtxOrderTypeAdapter'
import { FtxSideAdapter } from '../enums/adapters/FtxSideAdapter'
import { FtxOrderTypeEnum } from '../enums/FtxOrderTypeEnum'
import { FtxHttp } from '../FtxHttp'
import { FtxLog } from '../FtxLog'
import {
  FtxSpecs,
  PROD_FTX_URL,
} from '../FtxSpecs'
import {
  IFtxOrderRequest,
  IFtxOrderSchema,
} from '../schemas/IFtxOrderSchema'
import { IFtxResponseSchema } from '../schemas/IFtxSchema'
import { FtxOrderReadModule } from './FtxOrderReadModule'



export class FtxOrderWriteModule extends FtxOrderReadModule implements IAlunaOrderWriteModule {

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

    let requestCount = 0

    try {

      const accountSpecs = FtxSpecs.accounts.find((a) => a.type === account)

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

      if (!supported || !implemented || !orderTypes) {

        throw new AlunaError({
          message:
            `Account type '${account}' not supported/implemented for Ftx`,
          code: AlunaAccountsErrorCodes.TYPE_NOT_SUPPORTED,
        })

      }

      const orderType = orderTypes.find((o) => o.type === type)

      if (!orderType || !orderType.implemented || !orderType.supported) {

        throw new AlunaError({
          message: `Order type '${type}' not supported/implemented for Ftx`,
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

      FtxLog.error(error)

      throw error

    }

    const translatedOrderType = FtxOrderTypeAdapter.translateToFtx({
      from: type,
    })

    const body: IFtxOrderRequest = {
      side: FtxSideAdapter.translateToFtx({ from: side }),
      market: symbolPair,
      size: amount,
      type: translatedOrderType,
      price: null,
    }

    if (translatedOrderType === FtxOrderTypeEnum.LIMIT) {

      if (!rate) {

        throw new AlunaError({
          message: 'A rate is required for limit orders',
          code: AlunaGenericErrorCodes.PARAM_ERROR,
          httpStatusCode: 401,
        })

      }

      body.price = rate

    }

    FtxLog.info('placing new order for Ftx')

    let placedOrder: IFtxOrderSchema

    try {

      const {
        data: {
          result,
        },
        requestCount: apiRequestCount,
      } = await FtxHttp
        .privateRequest<IFtxResponseSchema<IFtxOrderSchema>>({
          url: `${PROD_FTX_URL}/orders`,
          body,
          keySecret: this.exchange.keySecret,
        })

      placedOrder = result
      requestCount += apiRequestCount

    } catch (err) {

      const NOT_ENOUGH_BALANCE_MESSAGE = 'Not enough balances'

      let code = AlunaOrderErrorCodes.PLACE_FAILED

      if (err.message === NOT_ENOUGH_BALANCE_MESSAGE) {

        code = AlunaBalanceErrorCodes.INSUFFICIENT_BALANCE

      }

      throw new AlunaError({
        ...err,
        code,
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

    FtxLog.info('canceling order for Ftx')

    const {
      id,
      symbolPair,
    } = params

    let requestCount = 0

    try {

      const {
        requestCount: apiRequestCount,
      } = await FtxHttp.privateRequest<IFtxResponseSchema<string>>(
        {
          verb: AlunaHttpVerbEnum.DELETE,
          url: `${PROD_FTX_URL}/orders/${id}`,
          keySecret: this.exchange.keySecret,
        },
      )

      requestCount += apiRequestCount

    } catch (err) {

      const error = new AlunaError({
        message: 'Something went wrong, order not canceled',
        httpStatusCode: err.httpStatusCode,
        code: AlunaOrderErrorCodes.CANCEL_FAILED,
        metadata: err.metadata,
      })

      FtxLog.error(error)

      throw error

    }

    const { order, requestCount: getCount } = await this.get({
      id,
      symbolPair,
    })

    const totalRequestCount = requestCount + getCount

    return {
      order,
      requestCount: totalRequestCount,
    }

  }


  public async edit (
    params: IAlunaOrderEditParams,
  ): Promise<IAlunaOrderEditReturns> {


    FtxLog.info('editing order for Ftx')

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
