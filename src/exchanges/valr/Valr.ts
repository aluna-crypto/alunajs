import { AAlunaExchange } from '../../lib/core/abstracts/AAlunaExchange'
import {
  IAlunaExchange,
  IAlunaExchangeStatic,
} from '../../lib/core/IAlunaExchange'
import { IAlunaBalanceModule } from '../../lib/modules/IAlunaBalanceModule'
import { IAlunaKeyModule } from '../../lib/modules/IAlunaKeyModule'
import { IAlunaOrderWriteModule } from '../../lib/modules/IAlunaOrderModule'
import { IAlunaKeySecretSchema } from '../../lib/schemas/IAlunaKeySecretSchema'
import { IAlunaSettingsSchema } from '../../lib/schemas/IAlunaSettingsSchema'
import { ValrBalanceModule } from './modules/ValrBalanceModule'
import { ValrKeyModule } from './modules/ValrKeyModule'
import { ValrMarketModule } from './modules/ValrMarketModule'
import { ValrOrderWriteModule } from './modules/ValrOrderWriteModule'
import { ValrSymbolModule } from './modules/ValrSymbolModule'
import { ValrSpecs } from './ValrSpecs'



export const Valr: IAlunaExchangeStatic = class extends AAlunaExchange implements IAlunaExchange {

  // static definitions
  static readonly ID = ValrSpecs.id
  static readonly SPECS = ValrSpecs

  static Symbol = ValrSymbolModule
  static Market = ValrMarketModule


  // local definitions
  key: IAlunaKeyModule
  order: IAlunaOrderWriteModule
  balance: IAlunaBalanceModule



  constructor (
    params: {
      keySecret: IAlunaKeySecretSchema,
      settings?: IAlunaSettingsSchema,
    },
  ) {

    super(params)

    this.key = new ValrKeyModule({ exchange: this })
    this.balance = new ValrBalanceModule({ exchange: this })
    this.order = new ValrOrderWriteModule({ exchange: this })

  }

}
