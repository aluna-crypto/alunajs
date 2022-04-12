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
import { FtxSpecs } from './FtxSpecs'
import { FtxBalanceModule } from './modules/FtxBalanceModule'
import { FtxKeyModule } from './modules/FtxKeyModule'
import { FtxMarketModule } from './modules/FtxMarketModule'
import { FtxOrderWriteModule } from './modules/FtxOrderWriteModule'
import { FtxSymbolModule } from './modules/FtxSymbolModule'



export const Ftx: IAlunaExchangeStatic = class extends AAlunaExchange implements IAlunaExchange {

  // static definitions
  static readonly ID = FtxSpecs.id
  static readonly SPECS = FtxSpecs

  static Symbol = FtxSymbolModule
  static Market = FtxMarketModule

  // local definitions
  key: IAlunaKeyModule
  order: IAlunaOrderWriteModule
  balance: IAlunaBalanceModule

  constructor (params: {
    keySecret: IAlunaKeySecretSchema,
  }) {

    super(params)

    this.key = new FtxKeyModule({ exchange: this })
    this.balance = new FtxBalanceModule({ exchange: this })
    this.order = new FtxOrderWriteModule({ exchange: this })

  }

  public static validateSettings (
    settings: IAlunaSettingsSchema,
  ): boolean {

    const valid = !settings.affiliateCode && !settings.orderAnnotation

    return valid

  }

}
