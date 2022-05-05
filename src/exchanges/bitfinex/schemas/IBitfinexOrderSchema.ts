import { BitfinexOrderTypeEnum } from '../enums/BitfinexOrderTypeEnum'



// TODO: Describe order interface for Bitfinex exchange
export interface IBitfinexOrderSchema {
  id: string
  type: BitfinexOrderTypeEnum
  quantity: string
  // ...
}
