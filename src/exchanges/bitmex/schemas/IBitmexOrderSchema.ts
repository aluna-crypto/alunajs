import { BitmexOrderTypeEnum } from '../enums/BitmexOrderTypeEnum'



// TODO: Describe order interface for Bitmex exchange
export interface IBitmexOrderSchema {
  id: string
  symbol: string
  type: BitmexOrderTypeEnum
  // ...
}
