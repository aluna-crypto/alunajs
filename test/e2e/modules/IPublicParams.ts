import { IAlunaExchangePublic } from '../../../src/lib/core/IAlunaExchange'
import { IE2EExchange } from '../configs'
import { IModuleParams } from './IModuleParams'



export interface IPublicParams extends IModuleParams {
  exchangePublic: IAlunaExchangePublic
  exchangeConfigs: IE2EExchange
}
