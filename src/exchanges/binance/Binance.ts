import { AAlunaExchange } from '../../lib/core/abstracts/AAlunaExchange'
import {
  IAlunaExchange,
  IAlunaExchangeStatic,
} from '../../lib/core/IAlunaExchange'
import { IAlunaBalanceModule } from '../../lib/modules/IAlunaBalanceModule'
import { IAlunaKeyModule } from '../../lib/modules/IAlunaKeyModule'
import { IAlunaOrderWriteModule } from '../../lib/modules/IAlunaOrderModule'
import { IAlunaKeySecretSchema } from '../../lib/schemas/IAlunaKeySecretSchema'
import { BinanceSpecs } from './BinanceSpecs'
import { BinanceBalanceModule } from './modules/BinanceBalanceModule'
import { BinanceKeyModule } from './modules/BinanceKeyModule'
import { BinanceMarketModule } from './modules/BinanceMarketModule'
import { BinanceOrderWriteModule } from './modules/BinanceOrderWriteModule'
import { BinanceSymbolModule } from './modules/BinanceSymbolModule'



export const Binance: IAlunaExchangeStatic = class extends AAlunaExchange implements IAlunaExchange {

    // static definitions
    static readonly ID = BinanceSpecs.id
    static readonly SPECS = BinanceSpecs

    static Symbol = BinanceSymbolModule
    static Market = BinanceMarketModule

    // local definitions
    key: IAlunaKeyModule
    order: IAlunaOrderWriteModule
    balance: IAlunaBalanceModule

    constructor (params: {
      keySecret: IAlunaKeySecretSchema,
    }) {

      super(params)

      this.key = new BinanceKeyModule({ exchange: this })
      this.balance = new BinanceBalanceModule({ exchange: this })
      this.order = new BinanceOrderWriteModule({ exchange: this })

    }

}
