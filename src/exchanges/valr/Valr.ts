import {
  AAlunaExchange,
} from '../../lib/abstracts/AAlunaExchange'
import {
  IAlunaExchange,
} from '../../lib/abstracts/IAlunaExchange'
import {
  IAlunaBalance,
} from '../../lib/modules/IAlunaBalance'
import {
  IAlunaKey,
} from '../../lib/modules/IAlunaKey'
import {
  IAlunaOrder,
} from '../../lib/modules/IAlunaOrder'
import {
  IAlunaKeySecretSchema,
} from '../../lib/schemas/IAlunaKeySecretSchema'
import {
  IAlunaSettingsSchema,
} from '../../lib/schemas/IAlunaSettingsSchema'
import {
  ValrBalance,
} from './lib/modules/ValrBalance'
import {
  ValrKey,
} from './lib/modules/ValrKey'
import {
  ValrMarket,
} from './lib/modules/ValrMarket'
import {
  ValrOrder,
} from './lib/modules/ValrOrder'
import {
  ValrSymbol,
} from './lib/modules/ValrSymbol'



export class Valr extends AAlunaExchange implements IAlunaExchange {
  // exchange identifiers
  static readonly ID = 'valr'
  static readonly Symbol = new ValrSymbol()
  static readonly Market = new ValrMarket()



  // instance (public) methods
  Key: IAlunaKey
  Order: IAlunaOrder
  Balance: IAlunaBalance



  // constructor
  constructor (
    params: {
      keySecret: IAlunaKeySecretSchema,
      settings?: IAlunaSettingsSchema
    },
  ) {
    super(params)

    this.Balance = new ValrBalance(this)
    this.Order = new ValrOrder(this)
    this.Key = new ValrKey(this)
  }
}
