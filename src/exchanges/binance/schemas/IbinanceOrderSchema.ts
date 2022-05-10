import { binanceOrderTypeEnum } from '../enums/binanceOrderTypeEnum'



// TODO: Describe order interface for binance exchange
export interface IbinanceOrderSchema {
  id: string
  symbol: string
  type: binanceOrderTypeEnum
  // ...
}
