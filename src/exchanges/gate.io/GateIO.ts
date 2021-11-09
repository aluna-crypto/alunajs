import { AAlunaExchange } from '../../lib/core/abstracts/AAlunaExchange'
import {
  IAlunaExchange,
  IAlunaExchangeStatic,
} from '../../lib/core/IAlunaExchange'
import { IAlunaBalanceModule } from '../../lib/modules/IAlunaBalanceModule'
import { IAlunaKeyModule } from '../../lib/modules/IAlunaKeyModule'
import { IAlunaOrderReadModule } from '../../lib/modules/IAlunaOrderModule'
import { IAlunaKeySecretSchema } from '../../lib/schemas/IAlunaKeySecretSchema'
import { IAlunaSettingsSchema } from '../../lib/schemas/IAlunaSettingsSchema'
import { GateIOSpecs } from './GateIOSpecs'
import { GateIOBalanceModule } from './modules/GateIOBalanceModule'
import { GateIOKeyModule } from './modules/GateIOKeyModule'
import { GateIOMarketModule } from './modules/GateIOMarketModule'
import { GateIOOrderReadModule } from './modules/GateIOOrderReadModule'
import { GateIOSymbolModule } from './modules/GateIOSymbolModule'



export const GateIO: IAlunaExchangeStatic = class extends AAlunaExchange implements IAlunaExchange {

  // static definitions
  static readonly ID = GateIOSpecs.id
  static readonly SPECS = GateIOSpecs

  static Symbol = GateIOSymbolModule
  static Market = GateIOMarketModule


  // local definitions
  key: IAlunaKeyModule
  order: IAlunaOrderReadModule
  balance: IAlunaBalanceModule



  constructor (
    params: {
      keySecret: IAlunaKeySecretSchema,
      settings?: IAlunaSettingsSchema,
    },
  ) {

    super(params)

    this.key = new GateIOKeyModule({ exchange: this })
    this.balance = new GateIOBalanceModule({ exchange: this })
    this.order = new GateIOOrderReadModule({ exchange: this })

  }

}
