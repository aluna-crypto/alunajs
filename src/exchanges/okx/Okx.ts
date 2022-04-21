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
import { OkxMarketModule } from './modules/OkxMarketModule'
import { OkxSymbolModule } from './modules/OkxSymbolModule'
import { OkxLog } from './OkxLog'
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

  constructor (params: {
    keySecret: IAlunaKeySecretSchema,
  }) {

    super(params)

    OkxLog.info('ignore') // @TODO

    // this.key = new OkxKeyModule({ exchange: this })
    // this.balance = new OkxBalanceModule({ exchange: this })
    // this.order = new OkxOrderWriteModule({ exchange: this })

  }

  public static validateSettings (
    settings: IAlunaSettingsSchema,
  ): boolean {

    const valid = !settings.affiliateCode && !settings.orderAnnotation

    return valid

  }

}
