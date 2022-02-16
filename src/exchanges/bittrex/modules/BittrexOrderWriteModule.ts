import { AlunaError } from '../../../lib/core/AlunaError'
import { AlunaFeaturesModeEnum } from '../../../lib/enums/AlunaFeaturesModeEnum'
import { AlunaHttpVerbEnum } from '../../../lib/enums/AlunaHtttpVerbEnum'
import { AlunaAccountsErrorCodes } from '../../../lib/errors/AlunaAccountsErrorCodes'
import { AlunaGenericErrorCodes } from '../../../lib/errors/AlunaGenericErrorCodes'
import { AlunaOrderErrorCodes } from '../../../lib/errors/AlunaOrderErrorCodes'
import {
  IAlunaOrderCancelParams,
  IAlunaOrderEditParams,
  IAlunaOrderPlaceParams,
  IAlunaOrderWriteModule,
} from '../../../lib/modules/IAlunaOrderModule'
import { IAlunaOrderSchema } from '../../../lib/schemas/IAlunaOrderSchema'
import { BittrexHttp } from '../BittrexHttp'
import { BittrexLog } from '../BittrexLog'
import {
  BittrexSpecs,
  PROD_BITTREX_URL,
} from '../BittrexSpecs'
import { BittrexOrderTypeAdapter } from '../enums/adapters/BittrexOrderTypeAdapter'
import { BittrexSideAdapter } from '../enums/adapters/BittrexSideAdapter'
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
      direction: BittrexSideAdapter.translateToBittrex({ from: side }),
      marketSymbol: symbolPair,
      type: translatedOrderType,
      quantity: Number(amount),
    }

    if (translatedOrderType === BittrexOrderTypeEnum.LIMIT) {

      if (!rate) {

        throw new AlunaError({
          message: 'A rate is required for limit orders',
          code: AlunaGenericErrorCodes.PARAM_ERROR,
          httpStatusCode: 401,
        })

      }

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

      placedOrder = await BittrexHttp
        .privateRequest<IBittrexOrderSchema>({
          url: `${PROD_BITTREX_URL}/orders`,
          body,
          keySecret: this.exchange.keySecret,
        })

    } catch (err) {

      throw new AlunaError({
        ...err,
        code: AlunaOrderErrorCodes.PLACE_FAILED,
      })

    }

    const order = await this.parse({
      rawOrder: placedOrder,
    })

    return order

  }



  public async cancel (
    params: IAlunaOrderCancelParams,
  ): Promise<IAlunaOrderSchema> {

    BittrexLog.info('canceling order for Bittrex')

    const {
      id,
    } = params

    let canceledOrder: IBittrexOrderSchema

    try {

      canceledOrder = await BittrexHttp.privateRequest<IBittrexOrderSchema>(
        {
          verb: AlunaHttpVerbEnum.DELETE,
          url: `${PROD_BITTREX_URL}/orders/${id}`,
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

      BittrexLog.error(error)

      throw error

    }

    const parsedOrder = this.parse({ rawOrder: canceledOrder })

    return parsedOrder

  }


  public async edit (
    params: IAlunaOrderEditParams,
  ): Promise<IAlunaOrderSchema> {


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
