import { AlunaError } from '../../../lib/core/AlunaError'
import { AlunaFeaturesModeEnum } from '../../../lib/enums/AlunaFeaturesModeEnum'
import {
  IAlunaOrderCancelParams,
  IAlunaOrderPlaceParams,
  IAlunaOrderWriteModule,
} from '../../../lib/modules/IAlunaOrderModule'
import { IAlunaExchangeOrderTypesSpecsSchema } from '../../../lib/schemas/IAlunaExchangeSpecsSchema'
import { IAlunaOrderSchema } from '../../../lib/schemas/IAlunaOrderSchema'
import { GateioLog } from '../GateioLog'
import { GateioSpecs } from '../GateioSpecs'
import { GateioOrderReadModule } from './GateioOrderReadModule'



export class GateioOrderWriteModule extends GateioOrderReadModule implements IAlunaOrderWriteModule {

  public async place (
    params: IAlunaOrderPlaceParams,
  ): Promise<IAlunaOrderSchema> {

    // TODO implement me

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
      } = GateioSpecs.accounts[account])

    } catch (error) {

      throw new AlunaError({
        message: `Account type '${account}' is not in Gateio specs`,
      })

    }

    if (!supported || !implemented || !supportedOrderTypes) {

      throw new AlunaError({
        message: `Account type '${account}' not supported/implemented for Varl`,
      })

    }

    const orderType = supportedOrderTypes[type]

    if (!orderType || !orderType.implemented || !orderType.supported) {

      throw new AlunaError({
        message: `Order type '${type}' not supported/implemented for Varl`,
      })

    }

    if (orderType.mode !== AlunaFeaturesModeEnum.WRITE) {

      throw new AlunaError({
        message: `Order type '${type}' is in read mode`,
      })

    }

    GateioLog.info('placing new order for Gateio')

    throw new Error('not implemented')

  }



  public async cancel (
    params: IAlunaOrderCancelParams,
  ): Promise<IAlunaOrderSchema> {

    // TODO implement me

    GateioLog.info('canceling order for Gateio')

    throw new Error('not implemented')

  }

}
