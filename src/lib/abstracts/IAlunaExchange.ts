import { IAlunaMarket } from '@lib/modules/IAlunaMarketModule'
import { IAlunaSymbol } from '@lib/modules/IAlunaSymbolModule'
import { IAlunaSettingsSchema } from '@lib/schemas/IAlunaSettingsSchema'

import { IAlunaBalance } from '../modules/IAlunaBalanceModule'
import { IAlunaKey } from '../modules/IAlunaKeyModule'
import { IAlunaOrder } from '../modules/IAlunaOrderModule'
import { IAlunaPosition } from '../modules/IAlunaPositionModule'
import { IAlunaKeySecretSchema } from '../schemas/IAlunaKeySecretSchema'



export interface IAlunaExchange {

  keySecret: IAlunaKeySecretSchema
  settings?: IAlunaSettingsSchema

  Symbol: IAlunaSymbol
  Market: IAlunaMarket

  Key: IAlunaKey
  Order: IAlunaOrder
  Balance: IAlunaBalance
  Position?: IAlunaPosition

}
