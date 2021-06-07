import { IAlunaBalanceModule } from '../modules/IAlunaBalanceModule'
import { IAlunaKeyModule } from '../modules/IAlunaKeyModule'
import { IAlunaMarketModule } from '../modules/IAlunaMarketModule'
import {
  IAlunaOrderReadModule,
  IAlunaOrderWriteModule,
} from '../modules/IAlunaOrderModule'
import { IAlunaPositionModule } from '../modules/IAlunaPositionModule'
import { IAlunaSymbolModule } from '../modules/IAlunaSymbolModule'
import { IAlunaExchangeSpecsSchema } from '../schemas/IAlunaExchangeSpecsSchema'
import { IAlunaKeySecretSchema } from '../schemas/IAlunaKeySecretSchema'
import { IAlunaSettingsSchema } from '../schemas/IAlunaSettingsSchema'



export interface IAlunaExchange {

  // basics
  keySecret: IAlunaKeySecretSchema
  settings?: IAlunaSettingsSchema

  // modules (private/signed)
  key: IAlunaKeyModule
  order: IAlunaOrderReadModule | IAlunaOrderWriteModule
  balance: IAlunaBalanceModule
  position?: IAlunaPositionModule

}



export interface IAlunaExchangeStatic {

  // constants
  ID: string
  SPECS: IAlunaExchangeSpecsSchema

  // modules (public)
  Symbol: IAlunaSymbolModule
  Market: IAlunaMarketModule

  new (params: {
    keySecret: IAlunaKeySecretSchema,
    settings?: IAlunaSettingsSchema,
  }): IAlunaExchange

}
