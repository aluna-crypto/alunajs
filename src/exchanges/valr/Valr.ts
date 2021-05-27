import { IAlunaExchange } from '@lib/abstracts/IAlunaExchange'
import { IAlunaBalanceModule } from '@lib/modules/IAlunaBalanceModule'
import { IAlunaKeyModule } from '@lib/modules/IAlunaKeyModule'
import { IAlunaMarketModule } from '@lib/modules/IAlunaMarketModule'
import { IAlunaOrderModule } from '@lib/modules/IAlunaOrderModule'
import { IAlunaPositionModule } from '@lib/modules/IAlunaPositionModule'
import { IAlunaSymbolModule } from '@lib/modules/IAlunaSymbolModule'
import { IAlunaKeySecretSchema } from '@lib/schemas/IAlunaKeySecretSchema'
import { IAlunaSettingsSchema } from '@lib/schemas/IAlunaSettingsSchema'

import { AAlunaExchange } from '../../lib/abstracts/AAlunaExchange'
import { ValrBalance } from './lib/modules/balance/ValrBalance'
import { ValrKey } from './lib/modules/key/ValrKey'
import { ValrMarket } from './lib/modules/market/ValrMarket'
import { ValrOrder } from './lib/modules/order/ValrOrder'
import { ValrSymbol } from './lib/modules/symbol/ValrSymbol'



export class Valr extends AAlunaExchange implements IAlunaExchange {

  Symbol: IAlunaSymbolModule

  Market: IAlunaMarketModule

  Key: IAlunaKeyModule

  Order: IAlunaOrderModule

  Balance: IAlunaBalanceModule

  Position?: IAlunaPositionModule | undefined

  constructor (
    params: {
      keySecret?: IAlunaKeySecretSchema
      settings?: IAlunaSettingsSchema
    },
  ) {

    super(params)

    this.keySecret = params.keySecret
    this.settings = params.settings


    this.Symbol = new ValrSymbol({
      exchange: this,
    })

    this.Market = new ValrMarket({
      exchange: this,
    })

    this.Key = new ValrKey({
      exchange: this,
    })

    this.Balance = new ValrBalance({
      exchange: this,
    })

    this.Order = new ValrOrder({
      exchange: this,
    })

  }

}
