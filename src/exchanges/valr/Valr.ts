import { AAlunaExchange } from '@lib/abstracts/AAlunaExchange'
import { IAlunaExchange } from '@lib/abstracts/IAlunaExchange'
import { IAlunaBalanceModule } from '@lib/modules/IAlunaBalanceModule'
import { IAlunaKeyModule } from '@lib/modules/IAlunaKeyModule'
import { IAlunaMarketModule } from '@lib/modules/IAlunaMarketModule'
import { IAlunaOrderWriteModule } from '@lib/modules/IAlunaOrderModule'
import { IAlunaSymbolModule } from '@lib/modules/IAlunaSymbolModule'
import { IAlunaKeySecretSchema } from '@lib/schemas/IAlunaKeySecretSchema'
import { IAlunaSettingsSchema } from '@lib/schemas/IAlunaSettingsSchema'

import { ValrBalanceModule } from './modules/ValrBalanceModule'
import { ValrKeyModule } from './modules/ValrKeyModule'
import { ValrMarketModule } from './modules/ValrMarketModule'
import { ValrOrderWriteModule } from './modules/ValrOrderWriteModule'
import { ValrSymbolModule } from './modules/ValrSymbolModule'
import { ValrSpecs } from './ValrSpecs'



export class Valr extends AAlunaExchange implements IAlunaExchange {

  readonly ID = 'valr'
  readonly SPECS = ValrSpecs

  Symbol: IAlunaSymbolModule
  Market: IAlunaMarketModule

  Key: IAlunaKeyModule
  Order: IAlunaOrderWriteModule
  Balance: IAlunaBalanceModule



  constructor (
    params: {
      keySecret: IAlunaKeySecretSchema,
      settings?: IAlunaSettingsSchema,
    },
  ) {

    super(params)

    this.Symbol = new ValrSymbolModule({ exchange: this })
    this.Market = new ValrMarketModule({ exchange: this })

    this.Key = new ValrKeyModule({ exchange: this })
    this.Balance = new ValrBalanceModule({ exchange: this })
    this.Order = new ValrOrderWriteModule({ exchange: this })

  }

}
