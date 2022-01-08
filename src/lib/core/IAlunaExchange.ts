import { IAlunaBalanceModule } from '../modules/IAlunaBalanceModule'
import { IAlunaKeyModule } from '../modules/IAlunaKeyModule'
import { IAlunaMarketModule } from '../modules/IAlunaMarketModule'
import { IAlunaOrderWriteModule } from '../modules/IAlunaOrderModule'
import { IAlunaPositionModule } from '../modules/IAlunaPositionModule'
import { IAlunaSymbolModule } from '../modules/IAlunaSymbolModule'
import { IAlunaExchangeSchema } from '../schemas/IAlunaExchangeSchema'
import { IAlunaKeySecretSchema } from '../schemas/IAlunaKeySecretSchema'
import { IAlunaSettingsSchema } from '../schemas/IAlunaSettingsSchema'



/*
  Due to TypeScript limitations, we need to use a combination of two
  interfaces to specify instance and static properties/methods sepparately.
*/

// Instance properties and methods
export interface IAlunaExchange {

  // basics
  keySecret: IAlunaKeySecretSchema
  settings?: IAlunaSettingsSchema

  // private modules
  key: IAlunaKeyModule

  // TODO: considering combining order read+write
  // TODO: considering making optional for web3 integrations (balance only)
  order: IAlunaOrderWriteModule

  balance: IAlunaBalanceModule
  position?: IAlunaPositionModule

}

// Static properties and methods
export interface IAlunaExchangeStatic {

  // static constants
  ID: string
  SPECS: IAlunaExchangeSchema

  // static public modules
  Symbol: IAlunaSymbolModule
  Market: IAlunaMarketModule

  // constructor must match the one of AAlunaExchange
  new (params: {
    keySecret: IAlunaKeySecretSchema,
    settings?: IAlunaSettingsSchema,
  }): IAlunaExchange

}
