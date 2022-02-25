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
import { GateioSpecs } from './GateioSpecs'
import { GateioBalanceModule } from './modules/GateioBalanceModule'
import { GateioKeyModule } from './modules/GateioKeyModule'
import { GateioMarketModule } from './modules/GateioMarketModule'
import { GateioOrderWriteModule } from './modules/GateioOrderWriteModule'
import { GateioSymbolModule } from './modules/GateioSymbolModule'



export const Gateio: IAlunaExchangeStatic = class extends AAlunaExchange implements IAlunaExchange {

  // static definitions
  static readonly ID = GateioSpecs.id
  static readonly SPECS = GateioSpecs

  static Symbol = GateioSymbolModule
  static Market = GateioMarketModule

  // local definitions
  key: IAlunaKeyModule
  order: IAlunaOrderWriteModule
  balance: IAlunaBalanceModule

  constructor (params: {
    keySecret: IAlunaKeySecretSchema,
    settings?: IAlunaSettingsSchema,
  }) {

    super(params)

    this.key = new GateioKeyModule({ exchange: this })
    this.balance = new GateioBalanceModule({ exchange: this })
    this.order = new GateioOrderWriteModule({ exchange: this })

  }

}
