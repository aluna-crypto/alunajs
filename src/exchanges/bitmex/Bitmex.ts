import { AAlunaExchange } from '../../lib/core/abstracts/AAlunaExchange'
import {
  IAlunaExchange,
  IAlunaExchangeStatic,
} from '../../lib/core/IAlunaExchange'
import { IAlunaBalanceModule } from '../../lib/modules/IAlunaBalanceModule'
import { IAlunaKeyModule } from '../../lib/modules/IAlunaKeyModule'
import { IAlunaOrderWriteModule } from '../../lib/modules/IAlunaOrderModule'
import { IAlunaPositionModule } from '../../lib/modules/IAlunaPositionModule'
import { BitmexSpecs } from './BitmexSpecs'
import { BitmexSymbolModule } from './modules/BitmexSymbolModule'



export const Bitmex: IAlunaExchangeStatic = class extends AAlunaExchange implements IAlunaExchange {

  // static definitions
  static readonly ID = BitmexSpecs.id
  static readonly SPECS = BitmexSpecs

  static Symbol = BitmexSymbolModule
  static Market = {} as any

  // local definitions
  key: IAlunaKeyModule
  // order: IAlunaOrderWriteModule
  order: IAlunaOrderWriteModule
  balance: IAlunaBalanceModule
  position: IAlunaPositionModule

  // constructor (
  //   params: {
  //     keySecret: IAlunaKeySecretSchema,
  //     settings?: IAlunaSettingsSchema,
  //   },
  // ) {

  //   super(params)

  //   this.key = new BitmexKeyModule({ exchange: this })
  //   this.balance = new BitmexBalanceModule({ exchange: this })
  //   this.order = new BitmexOrderWriteModule({ exchange: this })
  //   this.position = new BitmexPositionModule({ exchange: this })

  // }

}
