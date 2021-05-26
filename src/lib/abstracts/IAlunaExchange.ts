import { IAlunaMarketModule } from '@lib/modules/IAlunaMarketModule'
import { IAlunaSymbolModule } from '@lib/modules/IAlunaSymbolModule'
import { IAlunaSettingsSchema } from '@lib/schemas/IAlunaSettingsSchema'

import { IAlunaBalanceModule } from '../modules/IAlunaBalanceModule'
import { IAlunaKeyModule } from '../modules/IAlunaKeyModule'
import { IAlunaOrderModule } from '../modules/IAlunaOrderModule'
import { IAlunaPositionModule } from '../modules/IAlunaPositionModule'
import { IAlunaKeySecretSchema } from '../schemas/IAlunaKeySecretSchema'



export interface IAlunaExchange {

  keySecret: IAlunaKeySecretSchema
  settings?: IAlunaSettingsSchema

  Symbol: IAlunaSymbolModule
  Market: IAlunaMarketModule

  Key: IAlunaKeyModule
  Order: IAlunaOrderModule
  Balance: IAlunaBalanceModule
  Position?: IAlunaPositionModule

}
