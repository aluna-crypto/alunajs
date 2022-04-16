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
import { HuobiSpecs } from './HuobiSpecs'
import { HuobiBalanceModule } from './modules/HuobiBalanceModule'
import { HuobiMarketModule } from './modules/HuobiMarketModule'
import { HuobiSymbolModule } from './modules/HuobiSymbolModule'



export const Huobi: IAlunaExchangeStatic = class extends AAlunaExchange implements IAlunaExchange {

  // static definitions
  static readonly ID = HuobiSpecs.id
  static readonly SPECS = HuobiSpecs

  static Symbol = HuobiSymbolModule
  static Market = HuobiMarketModule

  // local definitions
  key: IAlunaKeyModule
  order: IAlunaOrderWriteModule
  balance: IAlunaBalanceModule

  constructor(params: {
    keySecret: IAlunaKeySecretSchema,
  }) {

    super(params)

    // @TODO
    // this.key = new HuobiKeyModule({ exchange: this })
    this.balance = new HuobiBalanceModule({ exchange: this })
    // this.order = new HuobiOrderWriteModule({ exchange: this })

  }

  public static validateSettings(
    settings: IAlunaSettingsSchema,
  ): boolean {

    const valid = !settings.affiliateCode && !settings.orderAnnotation

    return valid

  }

}