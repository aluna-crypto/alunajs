import { AAlunaExchange } from '../../lib/core/abstracts/AAlunaExchange'
import {
  IAlunaExchange,
  IAlunaExchangeStatic,
} from '../../lib/core/IAlunaExchange'
import { IAlunaBalanceModule } from '../../lib/modules/IAlunaBalanceModule'
import { IAlunaKeyModule } from '../../lib/modules/IAlunaKeyModule'
import { IAlunaOrderWriteModule } from '../../lib/modules/IAlunaOrderModule'
import { IAlunaPositionModule } from '../../lib/modules/IAlunaPositionModule'
import { IAlunaKeySecretSchema } from '../../lib/schemas/IAlunaKeySecretSchema'
import { IAlunaSettingsSchema } from '../../lib/schemas/IAlunaSettingsSchema'
import { OkxBalanceModule } from './modules/OkxBalanceModule'
import { OkxKeyModule } from './modules/OkxKeyModule'
import { OkxMarketModule } from './modules/OkxMarketModule'
import { OkxOrderWriteModule } from './modules/OkxOrderWriteModule'
import { OkxPositionModule } from './modules/OkxPositionModule'
import { OkxSymbolModule } from './modules/OkxSymbolModule'
import { OkxSpecs } from './OkxSpecs'



export const Okx: IAlunaExchangeStatic = class extends AAlunaExchange implements IAlunaExchange {

  // static definitions
  static readonly ID = OkxSpecs.id
  static readonly SPECS = OkxSpecs

  static Symbol = OkxSymbolModule
  static Market = OkxMarketModule

  // local definitions
  key: IAlunaKeyModule
  order: IAlunaOrderWriteModule
  balance: IAlunaBalanceModule
  position: IAlunaPositionModule

  constructor (params: {
    keySecret: IAlunaKeySecretSchema,
  }) {

    super(params)
    this.key = new OkxKeyModule({ exchange: this })
    this.balance = new OkxBalanceModule({ exchange: this })
    this.order = new OkxOrderWriteModule({ exchange: this })
    this.position = new OkxPositionModule({ exchange: this })

  }

  public static validateSettings (
    settings: IAlunaSettingsSchema,
  ): boolean {

    const valid = !settings.affiliateCode && !settings.orderAnnotation

    return valid

  }

}
