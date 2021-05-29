import { IAlunaMarketModule } from '@lib/modules/IAlunaMarketModule'
import {
  IAlunaOrderWriteModule, IAlunaOrderReadModule,
} from '@lib/modules/IAlunaOrderModule'
import { IAlunaSymbolModule } from '@lib/modules/IAlunaSymbolModule'
import {
  IAlunaExchangeSpecsSchema,
} from '@lib/schemas/IAlunaExchangeSpecsSchema'
import { IAlunaSettingsSchema } from '@lib/schemas/IAlunaSettingsSchema'

import { IAlunaBalanceModule } from '../modules/IAlunaBalanceModule'
import { IAlunaKeyModule } from '../modules/IAlunaKeyModule'
import { IAlunaPositionModule } from '../modules/IAlunaPositionModule'
import { IAlunaKeySecretSchema } from '../schemas/IAlunaKeySecretSchema'



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
  OrderRead: IAlunaOrderReadModule
  OrderWrite: IAlunaOrderWriteModule
  Balance: IAlunaBalanceModule
  Position?: IAlunaPositionModule

}
