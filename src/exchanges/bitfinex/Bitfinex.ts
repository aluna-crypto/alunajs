import { AAlunaExchange } from '../../lib/core/abstracts/AAlunaExchange'
import {
  IAlunaExchange,
  IAlunaExchangeStatic,
} from '../../lib/core/IAlunaExchange'
import { IAlunaBalanceModule } from '../../lib/modules/IAlunaBalanceModule'
import { IAlunaKeyModule } from '../../lib/modules/IAlunaKeyModule'
import { IAlunaOrderWriteModule } from '../../lib/modules/IAlunaOrderModule'
import { BitfinexSpecs } from './BitfinexSpecs'
import { BitfinexMarketModule } from './modules/BitfinexMarketModule'
import { BitfinexSymbolModule } from './modules/BitfinexSymbolModule'



export const Bitfinex: IAlunaExchangeStatic = class extends AAlunaExchange implements IAlunaExchange {

  // static definitions
  static readonly ID = BitfinexSpecs.id
  static readonly SPECS = BitfinexSpecs

  static Symbol = BitfinexSymbolModule
  static Market = BitfinexMarketModule

  // local definitions
  key: IAlunaKeyModule
  order: IAlunaOrderWriteModule
  balance: IAlunaBalanceModule

  // constructor (
  //   params: {
  //     keySecret: IAlunaKeySecretSchema,
  //     settings?: IAlunaSettingsSchema,
  //   },
  // ) {

  //   super(params)

  //   this.key = new BitfinexKeyModule({ exchange: this })
  //   this.balance = new BitfinexBalanceModule({ exchange: this })
  //   this.order = new BitfinexOrderWriteModule({ exchange: this })

  // }

}
