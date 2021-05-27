import { IAlunaExchange } from '@lib/abstracts/IAlunaExchange'
import { IAlunaMarketModule } from '@lib/modules/IAlunaMarketModule'
import { IAlunaSymbolModule } from '@lib/modules/IAlunaSymbolModule'

import { AAlunaExchange } from '../../lib/abstracts/AAlunaExchange'
import { IAlunaBalanceModule } from '../../lib/modules/IAlunaBalanceModule'
import { IAlunaKeyModule } from '../../lib/modules/IAlunaKeyModule'
import { IAlunaOrderModule } from '../../lib/modules/IAlunaOrderModule'
import { IAlunaKeySecretSchema } from '../../lib/schemas/IAlunaKeySecretSchema'
import { IAlunaSettingsSchema } from '../../lib/schemas/IAlunaSettingsSchema'
import { ValrBalance } from './lib/modules/balance/ValrBalance'
import { ValrSpecs } from './lib/ValrSpecs'



export class Valr extends AAlunaExchange implements IAlunaExchange {

  readonly ID = 'valr'
  readonly SPECS = ValrSpecs

  Symbol: IAlunaSymbolModule
  Market: IAlunaMarketModule

  Key: IAlunaKeyModule
  Order: IAlunaOrderModule
  Balance: IAlunaBalanceModule



  constructor (
    params: {
      keySecret: IAlunaKeySecretSchema
      settings?: IAlunaSettingsSchema
    },
  ) {

    super(params)

    this.Balance = new ValrBalance({ exchange: this })
    // this.Order = new ValrOrder(this)
    // this.Key = new ValrKey(this)
    // this.Balance = new ValrOrder2(this.privateRequest)

  }

}
