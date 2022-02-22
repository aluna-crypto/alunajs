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
import { PoloniexBalanceModule } from './modules/PoloniexBalanceModule'
import { PoloniexKeyModule } from './modules/PoloniexKeyModule'
import { PoloniexMarketModule } from './modules/PoloniexMarketModule'
import { PoloniexOrderWriteModule } from './modules/PoloniexOrderWriteModule'
import { PoloniexSymbolModule } from './modules/PoloniexSymbolModule'
import { PoloniexSpecs } from './PoloniexSpecs'



export const Poloniex: IAlunaExchangeStatic = class extends AAlunaExchange implements IAlunaExchange {

  // static definitions
  static readonly ID = PoloniexSpecs.id
  static readonly SPECS = PoloniexSpecs

  static Symbol = PoloniexSymbolModule
  static Market = PoloniexMarketModule

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

    this.key = new PoloniexKeyModule({ exchange: this })
    this.balance = new PoloniexBalanceModule({ exchange: this })
    this.order = new PoloniexOrderWriteModule({ exchange: this })

  }

}
