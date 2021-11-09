import { AlunaError } from '../../../lib/core/AlunaError'
import { AlunaFeaturesModeEnum } from '../../../lib/enums/AlunaFeaturesModeEnum'
import {
  IAlunaOrderCancelParams,
  IAlunaOrderPlaceParams,
  IAlunaOrderWriteModule,
} from '../../../lib/modules/IAlunaOrderModule'
import { IAlunaExchangeOrderTypesSpecsSchema } from '../../../lib/schemas/IAlunaExchangeSpecsSchema'
import { IAlunaOrderSchema } from '../../../lib/schemas/IAlunaOrderSchema'
import { GateIOLog } from '../GateIOLog'
import { GateIOSpecs } from '../GateIOSpecs'
import { GateIOOrderReadModule } from './GateIOOrderReadModule'



export class GateIOOrderWriteModule extends GateIOOrderReadModule implements IAlunaOrderWriteModule {

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
      } = GateIOSpecs.accounts[account])

    } catch (error) {

      throw new AlunaError({
        message: `Account type '${account}' is not in GateIO specs`,
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

    GateIOLog.info('placing new order for GateIO')

    throw new Error('not implemented')

  }



  public async cancel (
    params: IAlunaOrderCancelParams,
  ): Promise<IAlunaOrderSchema> {

    // TODO implement me

    GateIOLog.info('canceling order for GateIO')

    throw new Error('not implemented')

  }

}
