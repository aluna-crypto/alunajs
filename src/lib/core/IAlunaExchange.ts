import { IAlunaBalanceModule } from '../modules/authed/IAlunaBalanceModule'
import { IAlunaKeyModule } from '../modules/authed/IAlunaKeyModule'
import { IAlunaOrderWriteModule } from '../modules/authed/IAlunaOrderModule'
import { IAlunaPositionModule } from '../modules/authed/IAlunaPositionModule'
import { IAlunaMarketModule } from '../modules/public/IAlunaMarketModule'
import { IAlunaSymbolModule } from '../modules/public/IAlunaSymbolModule'
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
