import { IAlunaBalanceModule } from '../modules/IAlunaBalanceModule'
import { IAlunaKeyModule } from '../modules/IAlunaKeyModule'
import { IAlunaMarketModule } from '../modules/IAlunaMarketModule'
import { IAlunaOrderWriteModule } from '../modules/IAlunaOrderModule'
import { IAlunaPositionModule } from '../modules/IAlunaPositionModule'
import { IAlunaSymbolModule } from '../modules/IAlunaSymbolModule'
import { IAlunaCredentialsSchema } from '../schemas/IAlunaCredentialsSchema'
import { IAlunaExchangeSchema } from '../schemas/IAlunaExchangeSchema'
import { IAlunaSettingsSchema } from '../schemas/IAlunaSettingsSchema'



/**
 * Public things
 */

export interface IAlunaExchangePublic {

  // general
  id: string
  specs: IAlunaExchangeSchema
  settings: IAlunaSettingsSchema

  // public modules
  symbol: IAlunaSymbolModule
  market: IAlunaMarketModule

  // auth method
  auth (credentials: IAlunaCredentialsSchema): IAlunaExchangeAuthed

}



/**
 * Authenticated things
 */

export interface IAlunaExchangeAuthed extends IAlunaExchangePublic {

  // auth data
  credentials: IAlunaCredentialsSchema

  // private modules
  key: IAlunaKeyModule
  order: IAlunaOrderWriteModule
  balance: IAlunaBalanceModule
  position?: IAlunaPositionModule

}
