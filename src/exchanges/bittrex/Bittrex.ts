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
import { BittrexSpecs } from './BittrexSpecs'
import { BittrexBalanceModule } from './modules/BittrexBalanceModule'
import { BittrexMarketModule } from './modules/BittrexMarketModule'
import { BittrexSymbolModule } from './modules/BittrexSymbolModule'



export const Bittrex: IAlunaExchangeStatic = class extends AAlunaExchange implements IAlunaExchange {

  // static definitions
  static readonly ID = BittrexSpecs.id
  static readonly SPECS = BittrexSpecs

  static Symbol = BittrexSymbolModule
  static Market = BittrexMarketModule

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

    // @TODO - Update
    // this.key = new BittrexKeyModule({ exchange: this })
    this.balance = new BittrexBalanceModule({ exchange: this })
    // this.order = new BittrexOrderWriteModule({ exchange: this })

  }

}
