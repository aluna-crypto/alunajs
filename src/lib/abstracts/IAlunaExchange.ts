import { IAlunaMarketModule } from '@lib/modules/IAlunaMarketModule'
import { IAlunaSymbolModule } from '@lib/modules/IAlunaSymbolModule'
import { IAlunaExchangeSpecsSchema } from '@lib/schemas/IAlunaExchangeSpecsSchema'
import { IAlunaSettingsSchema } from '@lib/schemas/IAlunaSettingsSchema'

import { IAlunaBalanceModule } from '../modules/IAlunaBalanceModule'
import { IAlunaKeyModule } from '../modules/IAlunaKeyModule'
import { IAlunaOrderModule } from '../modules/IAlunaOrderModule'
import { IAlunaPositionModule } from '../modules/IAlunaPositionModule'
import { IAlunaKeySecretSchema } from '../schemas/IAlunaKeySecretSchema'



export interface IAlunaExchange {

  // constants
  ID: string
  SPECS: IAlunaExchangeSpecsSchema

  // basics
  keySecret?: IAlunaKeySecretSchema
  settings?: IAlunaSettingsSchema

  // modules (public)
  Symbol: IAlunaSymbolModule
  Market: IAlunaMarketModule

  // modules (private/signed)
  Key: IAlunaKeyModule
  Order: IAlunaOrderModule
  Balance: IAlunaBalanceModule
  Position?: IAlunaPositionModule

}
