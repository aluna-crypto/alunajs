import { IAlunaExchangeAuthed } from '../../../src/lib/core/IAlunaExchange'
import { IE2EExchange } from '../configs'
import { IModuleParams } from './IModuleParams'



export interface IAuthedParams extends IModuleParams {
  exchangeAuthed: IAlunaExchangeAuthed
  exchangeConfigs: IE2EExchange
}
