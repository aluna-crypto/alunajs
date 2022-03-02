import { AlunaError } from '../../../lib/core/AlunaError'
import { AlunaFeaturesModeEnum } from '../../../lib/enums/AlunaFeaturesModeEnum'
import { AlunaHttpVerbEnum } from '../../../lib/enums/AlunaHtttpVerbEnum'
import { AlunaAccountsErrorCodes } from '../../../lib/errors/AlunaAccountsErrorCodes'
import { AlunaOrderErrorCodes } from '../../../lib/errors/AlunaOrderErrorCodes'
import {
  IAlunaOrderCancelParams,
  IAlunaOrderEditParams,
  IAlunaOrderPlaceParams,
  IAlunaOrderWriteModule,
} from '../../../lib/modules/IAlunaOrderModule'
import { IAlunaOrderSchema } from '../../../lib/schemas/IAlunaOrderSchema'
import { GateioSideAdapter } from '../enums/adapters/GateioSideAdapter'
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
      side: GateioSideAdapter.translateToGateio({ from: side }),
      currency_pair: symbolPair,
      amount: amount.toString(),
      price: rate.toString(),
    }

    GateioLog.info('placing new order for Gateio')

    let placedOrder: IGateioOrderSchema

    try {

      placedOrder = await GateioHttp
        .privateRequest<IGateioOrderSchema>({
          url: `${PROD_GATEIO_URL}/spot/orders`,
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

    GateioLog.info('canceling order for Gateio')

    const {
      id,
      symbolPair,
    } = params

    let canceledOrder: IGateioOrderSchema

    const query = new URLSearchParams()

    query.append('currency_pair', symbolPair)

    try {

      canceledOrder = await GateioHttp.privateRequest<IGateioOrderSchema>(
        {
          verb: AlunaHttpVerbEnum.DELETE,
          url: `${PROD_GATEIO_URL}/spot/orders/${id}?${query.toString()}`,
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

      GateioLog.error(error)

      throw error

    }

    const parsedOrder = this.parse({ rawOrder: canceledOrder })

    return parsedOrder

  }


  public async edit (
    params: IAlunaOrderEditParams,
  ): Promise<IAlunaOrderSchema> {


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
