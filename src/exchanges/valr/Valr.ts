import { AAlunaExchange } from '@lib/abstracts/AAlunaExchange'
import { IAlunaExchange } from '@lib/abstracts/IAlunaExchange'
import { IAlunaBalanceModule } from '@lib/modules/IAlunaBalanceModule'
import { IAlunaKeyModule } from '@lib/modules/IAlunaKeyModule'
import { IAlunaMarketModule } from '@lib/modules/IAlunaMarketModule'
import {
  IAlunaOrderWriteModule,
  IAlunaOrderReadModule,
} from '@lib/modules/IAlunaOrderModule'
import { IAlunaSymbolModule } from '@lib/modules/IAlunaSymbolModule'
import { IAlunaKeySecretSchema } from '@lib/schemas/IAlunaKeySecretSchema'
import { IAlunaSettingsSchema } from '@lib/schemas/IAlunaSettingsSchema'

import { ValrBalanceModule } from './lib/modules/ValrBalanceModule'
import { ValrKeyModule } from './lib/modules/ValrKeyModule'
import { ValrMarketModule } from './lib/modules/ValrMarketModule'
import { ValrOrderReadModule } from './lib/modules/ValrOrderReadModule'
import { ValrOrderWriteModule } from './lib/modules/ValrOrderWriteModule'
import { ValrSymbolModule } from './lib/modules/ValrSymbolModule'
import { ValrSpecs } from './lib/ValrSpecs'



export class Valr extends AAlunaExchange implements IAlunaExchange {

  readonly ID = 'valr'
  readonly SPECS = ValrSpecs

  Symbol: IAlunaSymbolModule
  Market: IAlunaMarketModule

  Key: IAlunaKeyModule
  Order: IAlunaOrderReadModule
  OrderWrite: IAlunaOrderWriteModule
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
    this.Order = new ValrOrderReadModule({ exchange: this })
    this.OrderWrite = new ValrOrderWriteModule({ exchange: this })

  }

}
