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
import { FtxLog } from './FtxLog'
import { FtxSpecs } from './FtxSpecs'
import { FtxMarketModule } from './modules/FtxMarketModule'



export const Ftx: IAlunaExchangeStatic = class extends AAlunaExchange implements IAlunaExchange {

  // static definitions
  static readonly ID = FtxSpecs.id
  static readonly SPECS = FtxSpecs

  static Symbol = null as any
  // static Symbol = FtxSymbolModule
  static Market = FtxMarketModule

  // local definitions
  key: IAlunaKeyModule
  order: IAlunaOrderWriteModule
  balance: IAlunaBalanceModule

  constructor (params: {
    keySecret: IAlunaKeySecretSchema,
    settings?: IAlunaSettingsSchema,
  }) {

    super(params)

    FtxLog.info('Fodase')
    // @TODO -> Update
    // this.key = new FtxKeyModule({ exchange: this })
    // this.balance = new FtxBalanceModule({ exchange: this })
    // this.order = new FtxOrderWriteModule({ exchange: this })

  }

}
