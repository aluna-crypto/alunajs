import {
  IAlunaBalance,
} from '../modules/IAlunaBalance'
import {
  IAlunaKey,
} from '../modules/IAlunaKey'
import {
  IAlunaOrder,
} from '../modules/IAlunaOrder'
import {
  IAlunaPosition,
} from '../modules/IAlunaPosition'
import {
  IAlunaKeySecretSchema,
} from '../schemas/IAlunaKeySecretSchema'
// import { IAlunaSettingsSchema } from '../schemas/IAlunaOrderSchema'



export interface IAlunaExchange {

  /*
    Can't type static items?
  */
  // ID: string
  // Symbol: IAlunaSymbol
  // Market: IAlunaMarket

  keySecret: IAlunaKeySecretSchema
  // options?: IAlunaSettingsSchema

  Key: IAlunaKey
  Order: IAlunaOrder
  Balance: IAlunaBalance

  Position?: IAlunaPosition

}
