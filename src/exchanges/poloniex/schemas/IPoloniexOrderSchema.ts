import { PoloniexOrderTypeEnum } from '../enums/PoloniexOrderTypeEnum'



// TODO: Describe order interface for Poloniex exchange
export interface IPoloniexOrderSchema {
  id: string
  symbol: string
  type: PoloniexOrderTypeEnum
  // ...
}
