import {
  IAlunaBalanceModule,
  IAlunaExchange,
  IAlunaExchangeStatic,
  IAlunaKeyModule,
  IAlunaKeySecretSchema,
  IAlunaOrderWriteModule,
  IAlunaSettingsSchema,
} from '../../index'
import { AAlunaExchange } from '../../lib/core/abstracts/AAlunaExchange'
import { GateioLog } from './GateioLog'
import { GateioSpecs } from './GateioSpecs'



export const Gateio: IAlunaExchangeStatic = class extends AAlunaExchange implements IAlunaExchange {

  // static definitions
  static readonly ID = GateioSpecs.id
  static readonly SPECS = GateioSpecs

  // @TODO - Update
  static Symbol = null as any
  static Market = null as any
  //   static Symbol = GateioSymbolModule
  //   static Market = GateioMarketModule

  // local definitions
  key: IAlunaKeyModule
  order: IAlunaOrderWriteModule
  balance: IAlunaBalanceModule

  constructor (params: {
    keySecret: IAlunaKeySecretSchema,
    settings?: IAlunaSettingsSchema,
  }) {

    super(params)

    // @TODO - Update
    GateioLog.info('eslint-pass')
    // this.key = new GateioKeyModule({ exchange: this })
    // this.balance = new GateioBalanceModule({ exchange: this })
    // this.order = new GateioOrderWriteModule({ exchange: this })

  }

}
