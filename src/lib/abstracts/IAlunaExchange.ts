import { IAlunaBalanceModule } from '../modules/IAlunaBalanceModule'
import { IAlunaKeyModule } from '../modules/IAlunaKeyModule'
import { IAlunaMarketModule } from '../modules/IAlunaMarketModule'
import {
  IAlunaOrderReadModule, IAlunaOrderWriteModule,
} from '../modules/IAlunaOrderModule'
import { IAlunaPositionModule } from '../modules/IAlunaPositionModule'
import { IAlunaSymbolModule } from '../modules/IAlunaSymbolModule'
import { IAlunaExchangeSpecsSchema } from '../schemas/IAlunaExchangeSpecsSchema'
import { IAlunaKeySecretSchema } from '../schemas/IAlunaKeySecretSchema'
import { IAlunaSettingsSchema } from '../schemas/IAlunaSettingsSchema'



export interface IAlunaExchange {

  // constants
  ID: string
  SPECS: IAlunaExchangeSpecsSchema

  // basics
  keySecret: IAlunaKeySecretSchema
  settings?: IAlunaSettingsSchema

  // modules (public)
  Symbol: IAlunaSymbolModule
  Market: IAlunaMarketModule

  // modules (private/signed)
  Key: IAlunaKeyModule
  Order: IAlunaOrderReadModule | IAlunaOrderWriteModule
  Balance: IAlunaBalanceModule
  Position?: IAlunaPositionModule

}
